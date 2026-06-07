# Module 3 Lab Submission
## Version Control and Collaborative Tooling
**Student:** NathnelTK  
**Repository:** https://github.com/NathnelTK/M3-Version-Control-and-Collaborative-Tooling  
**Date:** June 7, 2026

---

## Repository Setup & Code Migration

### Step 1 — Created new public GitHub repository

```
gh repo create M3-Version-Control-and-Collaborative-Tooling --public
✓ Created repository NathnelTK/M3-Version-Control-and-Collaborative-Tooling
https://github.com/NathnelTK/M3-Version-Control-and-Collaborative-Tooling
```

### Step 2 — Copied TypeScript source files (no .git folder)

Files copied from tms-client into fresh folder:
```
.gitignore
README.md
index.ts
package.json
tsconfig.json
models/api-response.model.ts
models/assessment.model.ts
models/course.model.ts
models/enrollment.model.ts
models/student.model.ts
```

### Step 3 — Fresh git init and first push

```bash
git init
git remote add origin https://github.com/NathnelTK/M3-Version-Control-and-Collaborative-Tooling.git
git add .
git commit -m "chore: initial project setup - migrate tms-client TypeScript source files"
git branch -M main
git push -u origin main
```

Output:
```
Initialized empty Git repository
[master (root-commit) 69179b7] chore: initial project setup - migrate tms-client TypeScript source files
 10 files changed, 338 insertions(+)
* [new branch] main -> main
branch 'main' set up to track 'origin/main'.
```

---

## Exercise 1 — Modern Git Syntax (switch / restore)

The lab replaces `git checkout` with the two focused commands:
- `git switch` — for changing branches
- `git restore` — for discarding file changes

### Created feature branch with git switch

```bash
git switch -c feature/enrollment-validator
# Switched to a new branch 'feature/enrollment-validator'
```

### Demonstrated git restore (discard unstaged change)

```bash
# Added a scratch line to enrollment.model.ts
echo "// scratch work - to be discarded" >> models/enrollment.model.ts

# Discarded it with git restore instead of git checkout -- <file>
git restore models/enrollment.model.ts

# Verified file is clean
git diff models/enrollment.model.ts
# (no output — file restored)
```

### Committed real feature work with Conventional Commit

```bash
# Added validateEnrollmentCapacity function to enrollment.model.ts
git add models/enrollment.model.ts
git commit -m "feat(enrollment): add max capacity validator"
# [feature/enrollment-validator ea706f7] feat(enrollment): add max capacity validator
```

### Switched back to main

```bash
git switch main
# Switched to branch 'main'
```

**Key insight:** `git switch` and `git restore` make intent explicit — one command does one thing, unlike the overloaded `git checkout`.

---

## Exercise 2 — Detached HEAD & reflog Recovery

### Entered detached HEAD state

```bash
git checkout 69179b7
```

Output:
```
Note: switching to '69179b7'.
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.
HEAD is now at 69179b7 chore: initial project setup
```

### Made a commit in detached HEAD (simulating "lost" work)

```bash
echo "// temporary experiment in detached HEAD" >> models/assessment.model.ts
git add models/assessment.model.ts
git commit -m "experiment: detached HEAD test commit (will appear lost)"
# [detached HEAD 8552570] experiment: detached HEAD test commit
```

### Switched away — commit appears lost

```bash
git switch main
git log --oneline -3
# 69179b7 (HEAD -> main) chore: initial project setup
# (8552570 is no longer visible)
```

### Used reflog to find and recover the lost commit

```bash
git reflog
```

Output:
```
69179b7 HEAD@{0}: checkout: moving from 8552570... to main
8552570 HEAD@{1}: commit: experiment: detached HEAD test commit (will appear lost)
69179b7 HEAD@{2}: checkout: moving from main to 69179b7
...
```

```bash
# Recover by creating a branch from the lost hash
git branch recovered/detached-experiment 8552570

git log --oneline recovered/detached-experiment
# 8552570 experiment: detached HEAD test commit (will appear lost)
# 69179b7 chore: initial project setup
```

**Key insight:** `git reflog` is a local safety net — it tracks every HEAD movement for ~90 days. No commit is truly lost until the reflog expires.

---

## Exercise 3 — Atomic Commit Literacy

Created `feature/certificate-generator` branch and made 4 separate atomic commits, each doing exactly one thing:

```bash
git switch -c feature/certificate-generator
```

### Commit 1 — Add interface only
```bash
git add models/certificate.model.ts
git commit -m "feat(certificate): add Certificate interface and CertificateType union"
# [feature/certificate-generator 98bf984]
```

### Commit 2 — Add function only
```bash
git add models/certificate.model.ts
git commit -m "feat(certificate): add generateCertificate factory function"
# [feature/certificate-generator dbad573]
```

### Commit 3 — WIP debug (intentionally messy)
```bash
git add models/certificate.model.ts
git commit -m "wip: add debug log for certificate generation"
# [feature/certificate-generator 6133566]
```

### Commit 4 — Fix/cleanup
```bash
git add models/certificate.model.ts
git commit -m "fix(certificate): remove debug log and clean up comments"
# [feature/certificate-generator 3060ab5]
```

### Log showing atomic history
```bash
git log --oneline feature/certificate-generator
# 3060ab5 fix(certificate): remove debug log and clean up comments
# 6133566 wip: add debug log for certificate generation
# dbad573 feat(certificate): add generateCertificate factory function
# 98bf984 feat(certificate): add Certificate interface and CertificateType union
# 69179b7 chore: initial project setup
```

**Key insight:** Atomic commits mean one logical change per commit. This makes `git bisect`, `git revert`, and code review dramatically easier.

---

## Exercise 4 — Merge Conflict via Pull Requests

Following the professor's alternative PR-based workflow.

### Created base file on main

```bash
# assessment-config.ts created with gradingMethod: "standard"
git add assessment-config.ts
git commit -m "chore: add assessment-config base file"
git push origin main
```

### Created two branches off main editing the same line

```bash
# Branch 1 — Team member 1 sets gradingMethod to "weighted"
git switch -c conflict-one
# edited assessment-config.ts: gradingMethod: "weighted"
git commit -m "feat(assessment): set gradingMethod to weighted"
git push -u origin conflict-one

# Branch 2 — Team member 2 sets same line to "curved"
git switch main
git switch -c conflict-two
# edited assessment-config.ts: gradingMethod: "curved"
git commit -m "feat(assessment): set gradingMethod to curved"
git push -u origin conflict-two
```

### Opened two PRs on GitHub

```bash
gh pr create --base main --head conflict-one --title "feat(assessment): set gradingMethod to weighted"
# PR #1 created

gh pr create --base main --head conflict-two --title "feat(assessment): set gradingMethod to curved"
# PR #2 created
```

### Merged PR #1 first

```bash
gh pr merge 1 --merge
# ✓ Merged pull request #1 (feat(assessment): set gradingMethod to weighted)
```

### GitHub blocked PR #2 — merge conflict detected

After merging PR #1, GitHub flagged PR #2 as having a merge conflict because both branches edited the same line (`gradingMethod`) in `assessment-config.ts`.

### Conflict markers shown in file

```
<<<<<<< HEAD
  gradingMethod: "curved",
=======
  gradingMethod: "weighted",
>>>>>>> main
```

### Resolved conflict manually

```bash
git switch conflict-two
git merge main
# CONFLICT (content): Merge conflict in assessment-config.ts
# Automatic merge failed; fix conflicts and then commit the result.
```

Opened `assessment-config.ts`, removed conflict markers, kept `"weighted"` as the team decision:

```typescript
export const assessmentConfig = {
  passingGrade: 50,
  maxRetries: 3,
  gradingMethod: "weighted",
};
```

```bash
git add assessment-config.ts
git commit -m "fix(assessment): resolve merge conflict - keep weighted gradingMethod"
git push origin conflict-two
```

### Merged PR #2 after resolution

```bash
gh pr merge 2 --merge
# ✓ Merged pull request #2
```

### Git graph showing merge history

```bash
git log --graph --oneline --all
```

Output:
```
*   18bb470 feat(certificate): add Certificate model - squashed history
|\
| * 2f748c3 feat(certificate): add Certificate model and generateCertificate factory function
|/
*   e7cf101 fix(assessment): resolve merge conflict - keep weighted gradingMethod
|\
| *   b9494b6 fix(assessment): resolve merge conflict - keep weighted gradingMethod
| |\
| |/
|/|
* |   c5e1de9 feat(assessment): set gradingMethod to weighted
|\ \
| * | 09bca7e feat(assessment): set gradingMethod to weighted
|/ /
| * 28d97d0 feat(assessment): set gradingMethod to curved
|/
* 3d0a66c chore: add assessment-config base file
* 69179b7 chore: initial project setup
```

---

## Exercise 5 — Safe Squash Workflow

The 4 messy commits on `feature/certificate-generator` needed to be presented as one clean commit on `main`.

### Created cleanup branch from main

```bash
git switch main
git switch -c cleanup/certificate-generator
```

### Squash merged the 4 commits into staged changes

```bash
git merge --squash feature/certificate-generator
git status
# Changes to be committed:
#   new file: models/certificate.model.ts
```

`--squash` collapses all commits from the source branch into staged changes without creating a merge commit — giving full control over the final commit message.

### Committed as one clean atomic commit

```bash
git commit -m "feat(certificate): add Certificate model and generateCertificate factory function"
# [cleanup/certificate-generator 2f748c3] feat(certificate): ...
```

### Opened PR and merged

```bash
git push -u origin cleanup/certificate-generator
gh pr create --base main --head cleanup/certificate-generator \
  --title "feat(certificate): add Certificate model - squashed history"
gh pr merge 3 --merge
# ✓ Merged pull request #3
```

### Before vs After

Before (messy history on feature branch):
```
3060ab5 fix(certificate): remove debug log and clean up comments
6133566 wip: add debug log for certificate generation
dbad573 feat(certificate): add generateCertificate factory function
98bf984 feat(certificate): add Certificate interface and CertificateType union
```

After (clean single commit on main):
```
18bb470 feat(certificate): add Certificate model - squashed history
```

**Key insight:** `git reset --soft` and `git merge --squash` both enable squashing. `--squash` is safer for merging feature branches because it doesn't rewrite shared history.

---

## Module 3 Completion Checklist

- [x] Repository pushed to GitHub: https://github.com/NathnelTK/M3-Version-Control-and-Collaborative-Tooling
- [x] Reflog recovery demonstrated — `recovered/detached-experiment` branch saved commit `8552570`
- [x] Conventional Commits used — `feat(enrollment): add max capacity validator` on `feature/enrollment-validator`
- [x] Merge conflict created via two PRs, resolved manually, merge graph visible in git log
- [x] Squash workflow completed — 4 WIP commits collapsed into 1 clean commit on `cleanup/certificate-generator`

---

## Reflection Questions

### What new concepts or tools did you learn from this module?

**1. git switch and git restore replace git checkout**

Before this module I used `git checkout` for everything — switching branches, discarding changes, and detaching HEAD. Now I understand why this was confusing: `checkout` does fundamentally different things depending on its arguments. `git switch` is for branches only and `git restore` is for file content only. This separation makes commands self-documenting and prevents accidental mistakes like accidentally detaching HEAD when you meant to restore a file.

**2. Detached HEAD is not a disaster — reflog is always there**

I used to panic seeing "detached HEAD state." Now I understand it just means HEAD points to a commit instead of a branch. More importantly, `git reflog` records every single HEAD movement locally — so even commits made in detached HEAD that appear "lost" after switching branches can be recovered by finding their hash in the reflog and branching from it. This is a genuine safety net I will rely on going forward.

**3. Atomic commits make history useful**

Writing one logical change per commit feels slower but the payoff is huge. When something breaks, `git bisect` can pinpoint the exact commit. When a feature needs to be reverted, `git revert <hash>` targets exactly what you want. Messy multi-purpose commits make both of these nearly impossible. The Conventional Commits format (`feat:`, `fix:`, `chore:`) adds machine-readable structure that enables automated changelogs and semantic versioning.

**4. Merge conflicts are a workflow, not an emergency**

Simulating the conflict through two real PRs instead of one local machine made the real-world scenario clear: two developers editing the same line in parallel is normal. The process — merge first PR, see GitHub block second PR, pull main into your branch, resolve markers manually, push, merge — is a repeatable workflow that every team member needs to be comfortable with.

**5. Squash keeps main history clean**

The difference between merging a feature branch directly (which brings every WIP commit into main) versus using `--squash` (which presents the entire feature as one commit) is significant for long-lived projects. Clean main history means `git log` on main tells the story of features shipped, not implementation details like "fix typo" or "wip: debugging."
