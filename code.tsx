// This widget will open an Iframe window with buttons to show a toast message and close the window.

const { widget } = figma;
const {
  useEffect,
  useSyncedState,
  Text,
  AutoLayout,
  SVG,
  useWidgetId,
  Rectangle,
} = widget;

interface Note {
  title: string;
  comment: string;
  id: number;
  key: string;
}

function Widget() {
  const [notes, setNotes] = useSyncedState<Note[]>("sticky-notes", []);
  const [open, setOpen] = useSyncedState<boolean>("open-widget", true);

  const [showMore, setShowMore] = useSyncedState("open-comment", {});

  const widgetId = useWidgetId();

  useEffect(() => {
    figma.ui.on("message", (msg) => {
      if (msg.type === "create-notes") {
        figma.notify("Fetching notes...");
        setOpen(false);
        setNotes(msg.notes);

        figma.closePlugin();
      }
      if (msg.type === "close") {
        figma.closePlugin();
      }
    });
  });

  console.log("open", open);
  console.log("notes", notes);

  useEffect(() => {
    for (let i = 0; i < notes.length; i++) {
      const widgetNode = figma.getNodeById(widgetId) as WidgetNode;
      const clonedWidget = widgetNode.clone();

      widgetNode.parent!.appendChild(clonedWidget);
      clonedWidget.x = (i + 5) * 1000;
    }
  });

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
      name="Notes"
      fill={"#ffffff"}
    >
      <AutoLayout
        cornerRadius={16}
        spacing={48}
        direction="vertical"
        width={800}
        // height={
        //   showMore[note.id as keyof object]
        //     ? note.comment.length < 600
        //       ? 400
        //       : note.comment.length < 1000
        //       ? 600
        //       : note.comment.length < 10000
        //       ? 1000
        //       : "hug-contents"
        //     : 400
        // }
        height={400}
        strokeWidth={2}
        fill={"#f7f8fa"}
        hoverStyle={{ stroke: "#dce0e6", fill: "#fb3569" }}
        stroke="#dce0e6"
        strokeAlign="center"
        // key={note.id}
        name="a"
      >
        <AutoLayout
          // padding={
          //   note[i].comment.length < 300
          //     ? {
          //         horizontal: 48,
          //         vertical: 16,
          //       }
          //     : {
          //         horizontal: 24,
          //         vertical: 8,
          //       }
          // }
          spacing={24}
          width={"fill-parent"}
          height={"fill-parent"}
          direction="vertical"
        >
          <Text fontSize={32} width={"fill-parent"}>
            {/* {note.title} */}
            Title
          </Text>
          <AutoLayout
            padding={{
              horizontal: 4,
              vertical: 0,
            }}
            width={"fill-parent"}
            height={"fill-parent"}
            direction="vertical"
            spacing={8}
          >
            <Text
              // fontSize={
              //   showMore[note.id as keyof object]
              //     ? note.comment.length < 600
              //       ? 20
              //       : note.comment.length < 1000
              //       ? 16
              //       : note.comment.length < 10000
              //       ? 12
              //       : 10
              //     : 20
              // }
              width={"fill-parent"}
            >
              {/* {showMore[note.id as keyof object]
                  ? note.comment
                  : note.comment.slice(0, 501)} */}
              Comment
            </Text>
            <Text
              // onClick={() =>
              //   new Promise((resolve) => {
              //     setShowMore((comment) =>
              //       comment[note.id as keyof object]
              //         ? { ...comment, [note.id]: false }
              //         : { ...comment, [note.id]: true }
              //     );
              //   })
              // }
              fill={"#fb3569"}
            >
              {/* {note.comment.length > 500
                  ? showMore[note.id as keyof object]
                    ? "Show Less"
                    : "Show More"
                  : ""} */}
              Show More
            </Text>
          </AutoLayout>
          <Text
            // href={`https://app.heymarvin.com/annotation_tool/event/${note.key}`}
            italic
            fill={"#007bff"}
            fontWeight="bold"
            fontSize={16}
            horizontalAlignText={"center"}
            width={"fill-parent"}
          >
            Link to Note
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
