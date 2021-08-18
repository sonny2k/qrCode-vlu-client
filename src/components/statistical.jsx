import React from "react";

import { Bar } from "react-chartjs-2";
import { Card, Button } from "react-bootstrap";

import { paginate } from "../utils/paginate";

import StatisticalTable from "./statisticalTable";

import ReactExport from "react-data-export";

const Statistical = ({ myClass }) => {
  const [listLesson, setLessons] = React.useState([]);
  const [listNumOfAttendance, setListNumOfAttendance] = React.useState([]);
  const [listNumOfNonAttendance, setListNumNonOfAttendance] = React.useState(
    []
  );

  React.useEffect(() => {
    const listLesson = myClass.lessons.map((x) => x.name);
    const listNumOfAttendance = myClass.lessons.map((x) => x.numOfAttendance);
    const listNumOfNonAttendance = myClass.lessons.map(
      (x) => x.numOfNonAttendance
    );

    setLessons(listLesson);
    setListNumOfAttendance(listNumOfAttendance);
    setListNumNonOfAttendance(listNumOfNonAttendance);
  }, [myClass]);

  const data = {
    labels: [...listLesson],
    datasets: [
      {
        label: "Attended",
        data: [...listNumOfAttendance],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "Non Attended",
        data: [...listNumOfNonAttendance],
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      title: {
        display: true,
        text: "Summary of students' Attended and Non-Attended of each Lessons",
      },
    },
  };

  const getPagedData = () => {
    let filtered = myClass?.lessons;
    // if (searchQuery) {
    //   filtered = myClass.lessons.filter((x) =>
    //     x..toLowerCase().startsWith(searchQuery.toLowerCase())
    //   );
    // }
    const newLesson = paginate(filtered[0]?.students, 1, 1);

    return { totalCount: filtered[0].students.length, data: newLesson };
  };

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

  const DataSet = [
    {
      columns: [
        {
          title: "Student Mail",
          style: { font: { sz: "18", bold: true } },
          width: { wpx: 125 },
        }, // width in pixels
        {
          title: "Student Name",
          style: { font: { sz: "18", bold: true } },
          width: { wch: 30 },
        }, // width in characters
        ...myClass.lessons.map((lesson) => {
          return {
            title: lesson.name,
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 100 },
          };
        }), // width in pixels
      ],
      data: myClass.lessons[0].students.map((x, index) => [
        { value: x.mail, style: { font: { sz: "14" } } },
        { value: x.name, style: { font: { sz: "14" } } },
        ...myClass.lessons.map((y) => {
          return {
            value:
              y.students[index].status != "Not Attended"
                ? "Attended"
                : "Not Attended",
            style:
              y.students[index].status != "Not Attended"
                ? {
                    font: { color: { rgb: "ffffff" } },
                    fill: { patternType: "solid", fgColor: { rgb: "4bd909" } },
                  }
                : {
                    font: { color: { rgb: "000000" } },
                    fill: { tternType: "solid", fgColor: { rgb: "ffffff" } },
                  },
          };
        }),
      ]),
    },
  ];

  const { totalCount, data: newLesson } = getPagedData();

  return (
    <React.Fragment>
      <h4 className="title"></h4>
      <Bar data={data} options={options} width={100} height={10} />

      <Card className="striped-tabled-with-hover">
        <Card.Body className="table-full-width table-responsive px-auto py-auto">
          {totalCount === 0 ? (
            <p>Data empty</p>
          ) : (
            <>
              <StatisticalTable lessons={myClass.lessons} />
              <ExcelFile
                filename="my statistical"
                element={
                  <Button className="btn-fill btn-wd" variant="success">
                    <i className="fas fa-file-export"></i> Export Excel
                  </Button>
                }
              >
                <ExcelSheet dataSet={DataSet} name="Statistical" />
              </ExcelFile>
            </>
          )}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Statistical;
