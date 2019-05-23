import React from "react";
const { Fragment } = React;

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

const Render = Settings => {
  return (
    <Settings.Form>
      {ppp =>
        Settings.data.map(field => {
          return <Settings.RenderItem {...field} />;
        })
      }
    </Settings.Form>
  );
};

const RenderItem = item => {
  return <div>default renderItem</div>;
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

const DynamicForm = props => {
  const Settings = {
    // Form,
    // formInstance: props.form ? props.form : Form.create({}),
    items: props.items,
    RenderItem: props.renderItem ? props.renderItem : RenderItem,
    renderWrapper: props.wrapper
      ? props.wrapper
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

  if (Settings.templateContents.length) {
    return (
      <>
        {Settings.renderWrapper({
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
      {Settings.renderWrapper({
        ...Settings,
        getContents: ppp =>
          Settings.items.map(field => {
            return <Settings.RenderItem {...field} />;
          })
      })}
    </>
  );
};

export default DynamicForm;
