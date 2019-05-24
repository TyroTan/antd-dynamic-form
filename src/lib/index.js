import React from "react";
const { Fragment } = React;

const omitFields = (target, choices) => {
  const newObj = {};

  Object.keys(target).forEach(key => {
    if (choices[key] === true) return;
    newObj[key] = target[key];
  });

  return newObj;
};

const sortContents = arr => {
  return arr.sort((a, b) => {
    if (a.container.length === b.container.length) {
      return a.container > b.container;
    }
    return a.container.length < b.container.length;
  });
};

const sortStringKey = (a, b) => {
  if (a.length === b.length) {
    return a > b;
  }

  return a.length < b.length;
};

const isAntdComponentDefined = (Settings = {}, type) => {
  if (!Settings[type]) {
    throw Error(
      `Missing "${type}" component. "<AntdDynamicForm AntdComponents={{ ${type}..."`
    );
  }
};

const helperGetInputType = (Settings, item) => {
  switch (item.type) {
    case "slider":
      isAntdComponentDefined(Settings, "Slider");
      // return React.forwardRef((props, ref) => <Settings.Slider {...{...item.propsItem, ref}} />);
      return React.forwardRef((props, ref) => {
        // console.log("hugatsas", item.propsItem, { ...{ ...props, ref } });
        // const sliderProp = { ...props, ref };
        // delete sliderProp.value;
        // delete sliderProp.defaultValue;
        return <Settings.Slider {...item.propsItem} />;
      });
    case "button":
      isAntdComponentDefined(Settings, "Button");
      return React.forwardRef((props, ref) => <Settings.Button {...{...props, ref}} />);
    default:
      isAntdComponentDefined(Settings, "Input");
      return React.forwardRef((props, ref) => {
        return <Settings.Input {...{...props, ref}} />
      });
  }
};

const Render = Settings => {
  if (!Settings.Form) {
    throw Error(
      `Missing "Form" component. "<AntdDynamicForm AntdComponents={{ Form..."`
    );
  }
  if (!Settings.RenderItem) {
    throw Error(
      `Missing "renderItem". "<AntdDynamicForm renderItem={(item) => {...`
    );
  }

  return (
    <Settings.Form {...Settings.formProps}>
      {Settings.items.map(field => {
        const arg = {
          ...field,
          InputType: helperGetInputType(Settings, field)
        };

        // TODO: finalise requiring "key" instead
        const key = field.propsItem.name ? field.propsItem.name : field.propsItem.id;

        return <Settings.RenderItem key={key} {...arg} />;
      })}
    </Settings.Form>
  );
};

const RenderWithTemplate = Settings => {
  let templateContents = [...Settings.templateContents];

  const toRender = sortContents(templateContents).reduce((acc, content) => {
    const containerKey = content.container;

    const contentsArr = Settings.items.filter(
      item => item.container === containerKey
    );

    if (contentsArr.length) {
      if (!content.renderItem || !content.render) {
        let msg = "";
        try {
          msg = ` ${JSON.stringify(content)}`;
        } catch (e) {}
        throw Error(`Missing render or renderItem.${msg}`);
      }

      acc[containerKey] = () => {
        return content.render({
          getContents() {
            return contentsArr.map(item => {
              return content.renderItem(item);
            });
          }
        });
      };

      return acc;
    }

    acc[containerKey] = () => {
      return content.render({
        getContents() {
          const r = Object.keys(acc)
            .sort(sortStringKey)
            .filter(
              childKey =>
                childKey.indexOf(containerKey) === 0 &&
                childKey.length - 1 === containerKey.length
            )
            .reduce((nodes, currentNode) => {
              if (
                currentNode.indexOf(containerKey) === 0 &&
                currentNode.length - 1 === containerKey.length
              ) {
                nodes = nodes.concat([
                  <Fragment key={currentNode}>{acc[currentNode]()}</Fragment>
                ]);
              }

              return nodes;
            }, []);

          if (!r.length) {
            return <></>;
          }

          return r;
        }
      });
    };

    return acc;
  }, {});

  if (toRender) {
    return Object.keys(toRender)
      .filter(k => k.length === 1)
      .sort(sortStringKey)
      .map(container => {
        return <Fragment key={container}>{toRender[container]()}</Fragment>;
      });
  }

  return <></>;
};

const AntdDynamicForm = props => {
  const { AntdComponents = {}, items = [] } = props;
  if (AntdComponents.Form) {
    AntdComponents.formProps = omitFields(props, {
      AntdComponents: true,
      items: true,
      renderItem: true,
      render: true,
      template: true
    });
  }
  const Settings = {
    ...AntdComponents,
    // formInstance: props.form ? props.form : Form.create({}),
    items,
    RenderItem: props.renderItem,
    render: props.render
      ? props.render
      : params => {
          return <Render {...Settings} />;
        },
    templateContents:
      props.template &&
      props.template.contents &&
      props.template.contents.length
        ? props.template.contents
        : []
  };

  if (!Settings.items.length) {
    return <div/>
  }

  if (Settings.templateContents.length) {
    return (
      <>
        {Settings.render({
          ...Settings,
          getContents(ppp) {
            return <RenderWithTemplate {...Settings} />;
          }
        })}
      </>
    );
  }

  return (
    <>
      {Settings.render({
        ...Settings,
        getContents: ppp =>
          Settings.items.map(field => {
            return <Settings.RenderItem {...field} />;
          })
      })}
    </>
  );
};

export default AntdDynamicForm;
