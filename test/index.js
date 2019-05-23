import React from "react";
// import { connect } from "react-redux";
// import { Button, Divider, Icon, Input, Form, message, Modal } from "antd";
import { Button, Col, Form, Input, Row } from "antd";
import DynamicForm from "./DynamicForm";

const { useState } = React;

const Wrapped = props => {
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
        console.log("render props", props);
        return <Form>{props.getContents()}</Form>;
      }}
      items={state.items}
    />
  );
};

export default Form.create({})(Wrapped);
