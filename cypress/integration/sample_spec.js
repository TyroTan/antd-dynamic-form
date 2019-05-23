import * as ReactDOM from 'react-dom';
window.ReactDOM = ReactDOM;

/*
describe('My First Test', function() {
  it('finds the content "type"', function() {
    cy.visit('localhost:8080')

    cy.contains('her!!')
  })
})
*/

// load Cypress TypeScript definitions for IntelliSense
/// <reference types="cypress" />
// import the component you want to test
import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
const DynamicForm = require( "../../src/lib/index.js");

const { useState } = React;

const Test1 = props => {
  const { form } = props;
  const { getFieldDecorator } = form;
  const refs = {};

  const pushItem = () => {
    setState({
      items: [
        ...state.items,
        { container: "00", propsItem: getNewField("field4") }
      ]
    });
  };

  const getNewField = fieldName => {
    return {
      name: fieldName,
      placeholder: `${fieldName} placeholder`,
      ref: input => {
        refs[`refDynamicField_${fieldName}`] = input;
      },
      onChange: e => {
        if (fieldName === "field1" && e.target.value === "create") {
          pushItem();
        }
        setTimeout(() => refs[`refDynamicField_${fieldName}`].focus(), 0);
      }
    };
  };

  const [state, setState] = useState({
    items: [
      {
        container: "00",
        propsItem: getNewField("field1")
      },
      {
        container: "00",
        propsItem: getNewField("field2")
      },
      {
        container: "00",
        propsItem: getNewField("field3")
      }
    ]
  });

  return (
    <DynamicForm
      template={{
        contents: [
          {
            container: "0",
            render: ({ getContents }) => {
              return <Col md={12}>{getContents()}</Col>;
            }
          },
          {
            container: "1",
            render: ({ getContents }) => {
              return <Col md={12}>{getContents()}</Col>;
            }
          },
          {
            container: "00",
            render: ({ getContents }) => {
              return (
                <Col md={24}>
                  <Row
                    type="flex"
                    style={{ flexDirection: "column", margin: "5px" }}
                  >
                    {getContents()}
                  </Row>
                </Col>
              );
            },
            renderItem: item => {
              return (
                <Col md={6} key={item.propsItem.name}>
                  <Form.Item>
                    {getFieldDecorator(item.propsItem.name, {
                      initialValue: item.propsItem.name,
                      rules: [
                        {
                          required: true,
                          message: `${item.propsItem.name} field is required.`
                        }
                      ]
                    })(<Input {...item.propsItem} />)}
                  </Form.Item>
                </Col>
              );
            }
          },
          {
            container: "01",
            render: ({ getContents }) => {
              return <Col md={24}>{getContents()}</Col>;
            },
            renderItem: item => {
              return (
                <Col md={6} key={item.propsItem.name}>
                  <Form.Item>
                    {getFieldDecorator(item.propsItem.name, {
                      initialValue: item.propsItem.name,
                      rules: [
                        {
                          required: true,
                          message: `${item.propsItem.name} field is required.`
                        }
                      ]
                    })(<Input {...item.propsItem} />)}
                  </Form.Item>
                </Col>
              );
            }
          }
        ]
      }}
      wrapper={props => {
        return <Form>{props.getContents()}</Form>;
      }}
      items={state.items}
    />
  );
};

const WrappedTest1 = Form.create({})(Test1);

describe("Initial Test", () => {
  it("works", () => {
    // mount the component under test
    cy.mount(<Row><Col><WrappedTest1 /></Col></Row>);
    cy.get("input").should('have.length', 3)
    cy.get("input").first().clear().type('creat');
    cy.get("input").should('have.length', 3);
    cy.get("input").first().type('e');
    cy.get("input").should('have.length', 4);
  });
});
