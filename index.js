"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polyfill_1 = require("@js-temporal/polyfill");
const student_model_1 = require("./models/student.model");
const student = {
    id: "STU-001",
    name: "Hana Tadesse",
    enrollmentDate: polyfill_1.Temporal.Now.instant(),
};
//student.id = "STU-999";
//console.log(student.gpa?.toFixed(2));
//prints not yet graded, since gpa is null
//console.log(student.gpa?.toFixed(2) ?? "Not yet graded");
function processStudent(raw) {
    if ((0, student_model_1.isStudent)(raw)) {
        const gpaDisplay = raw.gpa?.toFixed(2) ?? "Not yet graded";
        console.log(`Student ${raw.name} GPA: ${gpaDisplay}`);
    }
    else {
        console.error("Invalid student data received");
    }
}
processStudent({ id: "STU-001", name: "Hana", gpa: 3.7 });
// Prints: Student Hana GPA: 3.70
processStudent(42);
// Prints: Invalid student data received
console.log((0, student_model_1.parseStudent)({ id: "STU-001", name: "Hana" }));
// Prints a valid Student object
(0, student_model_1.parseStudent)({ id: 42, name: "Test" });
// Throws: TypeError: Expected id to be a string, received number
