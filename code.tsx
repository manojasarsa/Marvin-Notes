// This widget will open an Iframe window with buttons to show a toast message and close the window.

const { widget } = figma;
const { useEffect, useSyncedState, Text, AutoLayout, SVG, useWidgetId } =
  widget;

interface Note {
  title: string;
  comment: string;
  id: number;
  key: string;
}

function Widget() {
  const [notes, setNotes] = useSyncedState<Note[]>("sticky-notes", []);
  const [open, setOpen] = useSyncedState<boolean>("open-widget", true);

  const widgetId = useWidgetId();

  return open ? (
    <AutoLayout
      verticalAlignItems="center"
      cornerRadius={8}
      direction="vertical"
      width={"hug-contents"}
      height={"hug-contents"}
      fill={"#edeff2"}
    >
      <AutoLayout fill={"#fb3569"} padding={16}>
        <Text fontSize={24} fill={"#ffffff"}>
          Marvin Notes
        </Text>
      </AutoLayout>

      <AutoLayout
        verticalAlignItems="center"
        padding={{
          horizontal: 8,
          vertical: 8,
        }}
        cornerRadius={8}
        direction="vertical"
        width={"hug-contents"}
        height={"hug-contents"}
        horizontalAlignItems="center"
        onClick={
          // Use async callbacks or return a promise to keep the Iframe window
          // opened. Resolving the promise, closing the Iframe window, or calling
          () =>
            new Promise((resolve) => {
              figma.showUI(__html__);

              figma.ui.on("message", (msg) => {
                if (msg.type === "create-notes") {
                  figma.notify("Fetching notes...");
                  setOpen(false);
                  setNotes(msg.notes);

                  // for (let i = 0; i < msg.notes.length; i++) {
                  //   const widgetNode = figma.getNodeById(
                  //     widgetId
                  //   ) as WidgetNode;
                  //   const clonedWidget = widgetNode.clone();

                  //   widgetNode.parent!.appendChild(clonedWidget);
                  //   clonedWidget.x = widgetNode.x + widgetNode.width + 500;
                  //   clonedWidget.y = widgetNode.y;
                  // }

                  figma.closePlugin();
                }
                if (msg.type === "close") {
                  figma.closePlugin();
                }
              });
            })
        }
      >
        <Text
          horizontalAlignText="center"
          verticalAlignText="center"
          fontFamily="Lora"
          fontSize={14}
        >
          Import Note
        </Text>
      </AutoLayout>
    </AutoLayout>
  ) : (
    <AutoLayout
      cornerRadius={8}
      spacing={80}
      direction="vertical"
      width={"hug-contents"}
      height={"hug-contents"}
      name="Notes"
      // verticalAlignItems="center"
      // horizontalAlignItems="center"
    >
      {notes.map((note, data) => (
        <AutoLayout
          verticalAlignItems="center"
          cornerRadius={8}
          spacing={48}
          direction="vertical"
          width={800}
          height={400}
          // horizontalAlignItems="center"
          strokeWidth={2}
          fill={"#f7f8fa"}
          hoverStyle={{ stroke: "#dce0e6", fill: "#fb3569" }}
          stroke="#dce0e6"
          strokeAlign="center"
        >
          <AutoLayout
            padding={{
              horizontal: 48,
              vertical: 24,
            }}
            // fill={"#fb3569"}
            spacing={24}
            width={"hug-contents"}
            height={"hug-contents"}
          >
            <Text>{note.title}</Text>
          </AutoLayout>
          <AutoLayout
            spacing={24}
            // fill={"#fb3569"}
            padding={{
              horizontal: 48,
              vertical: 8,
            }}
            width={"fill-parent"}
            height={"fill-parent"}
          >
            <Text>{note.comment}</Text>
          </AutoLayout>
          <AutoLayout
            spacing={24}
            // fill={"#fb3569"}
            padding={{
              horizontal: 48,
              vertical: 24,
            }}
          >
            <Text
              href={`https://app.heymarvin.com/annotation_tool/event/${note.key}`}
              italic
              fill={"#007bff"}
              fontWeight="bold"
            >
              Link to Note
            </Text>
          </AutoLayout>
        </AutoLayout>
      ))}
    </AutoLayout>
  );
}

widget.register(Widget);
