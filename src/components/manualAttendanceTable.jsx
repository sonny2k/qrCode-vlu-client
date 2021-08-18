import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { Button } from "react-bootstrap";

const ManualAttendanceTable = ({
  students,
  selectedStudent,
  sortColumn,
  isHandling,
  onManualAttendance,
  onSort,
}) => {
  const columns = [
    { path: "studentId", label: "Student ID" },
    {
      path: "name",
      label: "Display Name",
    },
    { path: "mail", label: "Mail" },
    {
      path: "status",
      label: "Status",
    },
    {
      key: "attendance",
      content: (student) => (
        <Button
          className="btn-fill btn-wd"
          type="button"
          disabled={isHandling}
          variant={student.status === "Not Attended" ? "success" : "warning"}
          onClick={() => onManualAttendance(student)}
        >
          {isHandling && student.mail === selectedStudent.mail ? (
            "Waiting"
          ) : (
            <>
              {student.status === "Not Attended"
                ? "Attendance"
                : "UnAttendance"}
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <TableCommon
      columns={columns}
      data={students}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default ManualAttendanceTable;
