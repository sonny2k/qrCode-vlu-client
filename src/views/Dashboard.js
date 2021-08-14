import React from "react";
// react-bootstrap components
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import FormCommon from "./../components/common/form";

import SemesterService from "../services/semesterService";
import ClassService from "../services/classService";
import _ from "lodash";
import Joi from "joi";
import { toast } from "react-toastify";

import LoadingPage from "../components/common/loadingPage";
import DashboardTable from "../components/dashboardTable";

import { paginate } from "../utils/paginate";

import Pagination from "../components/common/pagination";

import SearchBox from "../components/common/searchBox";

import ReactExport from "react-data-export";

import SecureLS from "secure-ls";

var ls = new SecureLS();

class Dashboard extends FormCommon {
  state = {
    data: {
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 1,
      name: "Hoc ky 1",
      symbol: "All Semesters",
    },
    semesters: [],
    classes: [],
    myStatisticalData: [],
    errors: {},
    isHandling: false,
    currentPage: 1,
    searchQuery: "",
    pageSize: 10,
    sortColumn: { path: "name", order: "asc" },
    isLoading: true,
    arrayTest: [],
    listName: [
      { _id: "All Semesters", name: "All Semesters" },
      { _id: "hoc ky 1", name: "Hoc ky 1" },
      { _id: "hoc ky 2", name: "Hoc ky 2" },
      { _id: "hoc ky 3", name: "Hoc ky 3" },
    ],
  };

  schema = Joi.object({
    startYear: Joi.number()
      .required()
      .label("Start Year")
      .min(new Date().getFullYear())
      .max(3000),
    endYear: Joi.number().required().label("End Year"),
    name: Joi.string().required().label("Display Name"),
    symbol: Joi.string().required().label("Symbol"),
  });

  async populateSemesters() {
    let semesters;
    try {
      semesters = ls.get("semestersList");
    } catch (error) {
      ls.remove("usersList");
    }

    if (!semesters) {
      const { data } = await SemesterService.getSemesters();
      semesters = data;
    }
    this.setState({ semesters });
  }

  async populateClasses() {
    let classes;
    try {
      classes = ls.get("classesList");
    } catch (error) {
      ls.remove("classesList");
    }

    if (!classes) {
      const { data } = await ClassService.getClasses();
      classes = data;
    }
    this.setState({ classes, isLoading: false });
  }

  componentDidMount() {
    this.populateSemesters();
    this.populateClasses();
  }

  doSubmit = async () => {
    try {
      const { onUpdateClass } = this.props;
      const { data } = await ClassService.saveClass(this.state.data);
      toast.success("Successfully");
      onUpdateClass(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  doChange = (input, data) => {
    if (input.name === "startYear") {
      data["endYear"] = parseInt(input.value) + 1;
      data["symbol"] = `HK${data["endYear"].toString().slice(2)}${data[
        "name"
      ].slice(7)}`;
    }
    if (input.value.startsWith("hoc ky")) {
      data["symbol"] = `HK${data["endYear"].toString().slice(2)}${data[
        "name"
      ].slice(7)}`;
    } else if (input.value.startsWith("All Semesters")) {
      data["symbol"] = `All Semesters`;
    }

    if (
      input.name === "endYear" &&
      _.parseInt(input.value) <= _.parseInt(this.state.data.startYear)
    ) {
      const { errors } = this.state;
      if (!errors[input.name]) {
        errors[input.name] = "End Year greater than Start Year";
        this.setState({ errors });
      }
    }

    return data;
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn: sortColumn });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSearchStudent = (query) => {
    this.setState({ searchQueryStudent: query, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      classes,
      sortColumn,
      currentPage,
      pageSize,
      searchQuery,
      searchQueryStudent,
    } = this.state;

    let filtered = [...classes];

    filtered = [...classes].filter((x) => {
      const startYear = _.parseInt(_.split(x.semester.year, "-", 2)[0]);
      const endYear = _.parseInt(_.split(x.semester.year, "-", 2)[1]);

      if (
        startYear >= this.state.data.startYear &&
        endYear <= this.state.data.endYear
      ) {
        if (this.state.data.symbol !== "All Semesters") {
          if (
            x.semester.name.toLowerCase() === this.state.data.name.toLowerCase()
          ) {
            return x;
          }
        } else {
          return x;
        }
      }
    });

    if (searchQuery) {
      filtered = filtered.filter(
        (x) =>
          x.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.classTermId.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.semester.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          x.lecturer.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const newClasses = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: newClasses };
  };

  render() {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

    const { totalCount, data: newClasses } = this.getPagedData();

    const {
      listName,
      pageSize,
      sortColumn,
      currentPage,
      isLoading,
      searchQuery,
      searchQueryStudent,
    } = this.state;

    const DataSet = [
      {
        columns: [
          {
            title: "SemesterId",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 125 },
          }, // width in pixels
          {
            title: "Class Term ID",
            style: { font: { sz: "18", bold: true } },
            width: { wch: 30 },
          }, // width in characters
          {
            title: "Class Name",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 100 },
          }, // width in pixels
          {
            title: "Lesson 1",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 2",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 3",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 4",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in characters
          {
            title: "Lesson 5",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 6",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 7",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 8",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 9",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 10",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 11",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 12",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 13",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 14",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels

          {
            title: "Lesson 15",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels

          {
            title: "Lesson 16",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 17",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 18",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 19",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 20",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 21",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 22",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 23",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 24",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
          {
            title: "Lesson 25",
            style: { font: { sz: "18", bold: true } },
            width: { wpx: 110 },
          }, // width in pixels
        ],
        data: newClasses.map((item) => [
          { value: item.semester.symbol, style: { font: { sz: "14" } } },
          { value: item.classTermId, style: { font: { sz: "14" } } },
          { value: item.name, style: { font: { sz: "14" } } },
          ...item.lessons.map((lesson) => {
            return {
              value: `${lesson.numOfAttendance}/${
                lesson.numOfNonAttendance + lesson.numOfAttendance
              }`,
              style: { font: { sz: "14" } },
            };
          }),
          ,
        ]),
      },
    ];

    console.log(DataSet);

    return (
      <React.Fragment>
        <div>
          <Container fluid>
            <Row>
              <Col md="12">
                <Card className="striped-tabled-with-hover">
                  <Card.Header>
                    <Card.Title as="h4">DashBoard</Card.Title>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-auto py-auto">
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            {this.renderInput("startYear", "From Year", "Year")}
                          </Col>
                          <Col>
                            {this.renderInput("endYear", "End Year", "Year")}
                          </Col>
                          <Col>
                            {this.renderSelect(
                              "name",
                              "Display Name",
                              listName
                            )}
                          </Col>
                          <Col>
                            {newClasses.length !== 0 ? (
                              <ExcelFile
                                filename="myStatiscal"
                                element={
                                  <Button
                                    className="btn-fill btn-wd"
                                    variant="success"
                                  >
                                    <i className="fas fa-file-export"></i>{" "}
                                    Export Excel
                                  </Button>
                                }
                              >
                                <ExcelSheet
                                  dataSet={DataSet}
                                  name="my export"
                                />
                              </ExcelFile>
                            ) : null}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <SearchBox
                      value={searchQuery}
                      onChange={this.handleSearch}
                      placeholder="Search with class name ..."
                    />

                    <LoadingPage isLoading={isLoading}>
                      {totalCount === 0 ? (
                        <p>Data empty</p>
                      ) : (
                        <>
                          <DashboardTable
                            classes={newClasses}
                            sortColumn={sortColumn}
                            searchQueryStudent={searchQueryStudent}
                            onSort={this.handleSort}
                          />
                          <div className="ml-3 mt-3">
                            <Pagination
                              itemsCount={totalCount}
                              pageSize={pageSize}
                              currentPage={currentPage}
                              onPageChange={this.handlePageChange}
                            />
                          </div>
                        </>
                      )}
                    </LoadingPage>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
