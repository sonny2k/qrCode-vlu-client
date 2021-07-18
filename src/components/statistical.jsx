import React from "react";

import ChartistGraph from "react-chartist";
import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";

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
  };

  return (
    <React.Fragment>
      <Bar data={data} width={100} height={10} />
      {/* <Card>
        <Card.Header>
          <Card.Title as="h4">2017 Sales</Card.Title>
          <p className="card-category">All products including Taxes</p>
        </Card.Header>
        <Card.Body>
          <div className="ct-chart" id="chartActivity">
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="legend">
            <i className="fas fa-circle text-info"></i>
            Attended <i className="fas fa-circle text-danger"></i>
            Non Attended
          </div>
          <hr></hr>
          <div className="stats">
            <i className="fas fa-check"></i>
            Data information certified
          </div>
        </Card.Footer>
      </Card> */}
    </React.Fragment>
  );
};

export default Statistical;
