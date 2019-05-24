import * as ReactDOM from 'react-dom';
window.ReactDOM = ReactDOM;

import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
const DynamicForm = require( "../../src/lib/index.js");

const { useState } = React;

const Test1 = props => {
  const { form } = props;
  const { getFieldDecorator } = form;

  const pushItem = () => {
    setState(prevState => ({
      items: [
        ...prevState.items.slice(0, prevState.items.length - 2),
        { propsItem: getNewField(`field${prevState.items.length - 1}`) },
        ...prevState.items.slice(prevState.items.length - 2)
      ]
    }));
  };

  const getNewField = fieldName => {
    return {
      name: fieldName,
      placeholder: `${fieldName} placeholder`
    };
  };

  const [state, setState] = useState({
    submitResult: "",
    items: [
      {
        propsItem: getNewField("field1")
      },
      {
        propsItem: getNewField("field2")
      },
      {
        propsItem: getNewField("field3")
      },
      {
        type: "button",
        propsItem: {
          id: "formSubmitBtn",
          type: "primary",
          htmlType: "submit",
          children: "Submit"
        }
      },
      {
        type: "button",
        propsItem: {
          id: "addNewBtn",
          type: "primary",
          children: "Add New",
          onClick: () => {
            pushItem();
          }
        }
      }
    ]
  });

  return (
    <Row style={{ margin: "48px" }}>
      <Col md={6}>
        <DynamicForm
          onSubmit={e => {
            e.preventDefault();
            form.validateFieldsAndScroll(async (err, values) => {
              if (!err)
                setState(prev => ({
                  submitResult: JSON.stringify(values)
                }));
            });
          }}
          AntdComponents={{ Button, Form, Input }}
          items={state.items}
          renderItem={({ InputType, propsItem, type } = {}) => {
            return (
              <Form.Item key={propsItem.name}>
                {type === 'button' ? ( // skip getFieldDecorator on buttons
                  <InputType {...propsItem} />
                ) : (
                  getFieldDecorator(
                    propsItem.name ? propsItem.name : propsItem.id,
                    {
                      initialValue: propsItem.name,
                      rules: [
                        {
                          required: true,
                          message: `${propsItem.name} field is required.`
                        }
                      ]
                    }
                  )(<InputType {...propsItem} />)
                )}
              </Form.Item>
            );
          }}
        />
        <div id="submitResult">{state.submitResult}</div>
      </Col>
    </Row>
  );
};

const WrappedTest1 = Form.create({})(Test1);

describe("Add input fields dynamically", () => {
  it("works", () => {
    // mount the component under test
    cy.mount(<Row><Col><WrappedTest1 /></Col></Row>);
    cy.get("input").should('have.length', 3);
    cy.get("#addNewBtn").click();
    cy.get("#addNewBtn").click();
    cy.get("input").should('have.length', 5);
    cy.get("#formSubmitBtn").click();
    cy.get("#submitResult").contains(`"field1":"field1"`);
    cy.get("#submitResult").contains(`"field2":"field2"`);
    cy.get("#submitResult").contains(`"field3":"field3"`);
    cy.get("#submitResult").contains(`"field4":"field4"`);
    cy.get("#submitResult").contains(`"field5":"field5"`);
  });
});
