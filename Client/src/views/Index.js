/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState, useContext } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import "./button.css";
import { AmmsContext } from "Context/AmmContext";

const Index = (props) => {
  const {
    tellhowmuchtoken,
    Tokensaftercalac,
    HandleTransactions,
    input,
    names,
    countss,
    Graphlabel,
  } = useContext(AmmsContext);
  // console.log(names);
  // console.log(Tokensaftercalac);

  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [todays, settodays] = useState(null);
  const [TIME, setTIME] = useState(null);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  // console.log(names);

  let Bardata = {
    labels: names,
    datasets: [
      {
        label: "Orders",
        data: countss,
        maxBarThickness: 10,
      },
    ],
  };
  // console.log(chartExample2.options);
  // setTimeout(() => {
  //   var today = new Date();
  // var dd = String(today.getDate()).padStart(2, '0');
  // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // var yyyy = today.getFullYear();

  // today = mm + '/' + dd + '/' + yyyy;
  // settodays(today)
  // }, 1);

  // setTimeout(() => {
  //   var timeto = new Date();
  //   var min = String(timeto.getMinutes()).padStart(2,'0');
  //   var hours = String(timeto.getHours()).padStart(2,'0');
  //   var secnd = String(timeto.getSeconds()).padStart(2,'0');
  //   timeto = hours + ':' + min + ':' + secnd;
  //   setTIME(timeto)
  // }, 1000);
// console.log(Graphlabel.);
  let data1 = {
    labels: Graphlabel.timestampxy,
    datasets: [
      {
        label: "Price of X",
        data: Graphlabel.PriceX,
      }
    ],
  };

  let data2 = {
    labels: Graphlabel.timestampxy,
    datasets: [
      {
        label: "Price of X",
        data: Graphlabel.PriceY,
      }
    ],
  };
  console.log(data1);
  console.log(data2);

  console.log(Graphlabel);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Token X</span>
                          <span className="d-md-none">X</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Token Y</span>
                          <span className="d-md-none">Y</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                {/*  */}
                <div className="chart">
                  <Line
                    data={ activeNav===1?data1:data2}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                  {/*  */}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Today's Total orders</h2>
                    {/* <h4 className="mb-0">{todays + " "+ TIME } </h4> */}
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}

                {/* this is the table of token tarsnfer */}
                <div className="chart">
                  <Bar
                    data={Bardata}
                    options={chartExample2.options}
                    tooltips={chartExample2.tooltips}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Token Transfer</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div> */}
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Transfer</th>
                    <th scope="col">Token To Sell</th>
                    <th scope="col">Token You Get</th>
                    <th scope="col">Transact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Ethereum to TokenX</th>
                    <td>
                      <input onChange={(e) => tellhowmuchtoken(1, e)} />
                    </td>
                    <td>{Tokensaftercalac.tokens1}</td>
                    <td>
                      <button
                        className="btn-grad"
                        onClick={() => HandleTransactions(1, input.tokens1)}
                      >
                        {" "}
                        Transact{" "}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">TokenX to Ethereum</th>
                    <td>
                      <input onChange={(e) => tellhowmuchtoken(2, e)} />
                    </td>
                    <td>{Tokensaftercalac.tokens2}</td>
                    <td>
                      <button
                        className="btn-grad"
                        onClick={() => HandleTransactions(2, input.tokens2)}
                      >
                        {" "}
                        Transact{" "}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Ethereum to TokenY</th>
                    <td>
                      <input onChange={(e) => tellhowmuchtoken(3, e)} />
                    </td>
                    <td>{Tokensaftercalac.tokens3}</td>
                    <td>
                      <button
                        className="btn-grad"
                        onClick={() => HandleTransactions(3, input.tokens3)}
                      >
                        {" "}
                        Transact{" "}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">TokenY to Ethereum</th>
                    <td>
                      <input onChange={(e) => tellhowmuchtoken(4, e)} />
                    </td>
                    <td>{Tokensaftercalac.tokens4}</td>
                    <td>
                      <button
                        className="btn-grad"
                        onClick={() => HandleTransactions(4, input.tokens4)}
                      >
                        {" "}
                        Transact{" "}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">TokenX to TokenY</th>
                    <td>
                      <input onChange={(e) => tellhowmuchtoken(5, e)} />
                    </td>
                    <td>{Tokensaftercalac.tokens5}</td>
                    <td>
                      <button
                        className="btn-grad"
                        onClick={() => HandleTransactions(5, input.tokens5)}
                      >
                        {" "}
                        Transact{" "}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">TokenY to TokenX</th>
                    <td>
                      <input onChange={(e) => tellhowmuchtoken(6, e)} />
                    </td>
                    <td>{Tokensaftercalac.tokens6}</td>
                    <td>
                      <button
                        className="btn-grad"
                        onClick={() => HandleTransactions(6, input.tokens6)}
                      >
                        {" "}
                        Transact{" "}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">60%</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">70%</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">75%</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">30%</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
