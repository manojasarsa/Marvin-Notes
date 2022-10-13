const { getNodeById, widget } = figma;
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
  id: string;
  key: string;
  labels: {
    data: [];
  };
}

function Widget() {
  const [open, setOpen] = useSyncedState<boolean>("open-widget", true);

  const [note] = useSyncedState("note", {
    title: "",
    comment: "",
    id: "",
    key: "",
    labels: {
      data: [
        {
          text: "",
        },
      ],
    },
  });

  const [showMore, setShowMore] = useSyncedState("open-comment", {});

  const widgetId = useWidgetId();

  return open || !note.id ? (
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
        onClick={() =>
          new Promise((resolve) => {
            figma.showUI(__html__);
            figma.ui.on("message", (msg) => {
              if (msg.type === "create-notes") {
                figma.notify("Fetching notes...");
                setOpen(false);

                // const originalNode = figma.getNodeById(widgetId) as WidgetNode;
                // let currentY = originalNode.y;
                // let defaultX = originalNode.x + originalNode.width + 10;
                // let currentX = defaultX;

                // for (let i = 1; i <= msg.notes.length; i++) {
                //   const clonedWidget = originalNode.cloneWidget({
                //     note: msg.notes[i - 1],
                //   });

                //   clonedWidget.x = currentX;
                //   clonedWidget.y = currentY;

                //   if (i % 5 === 0) {
                //     currentY = currentY + 400 + 40;
                //     currentX = defaultX;
                //   } else {
                //     currentX = currentX + 800 + 40;
                //   }
                // }

                const chunkIndex: any = [[], [], [], [], []];
                for (let i = 0; i < msg.notes.length; i += 1) {
                  chunkIndex[i % 5].push(i);
                }

                const originalNode = figma.getNodeById(widgetId) as WidgetNode;
                let currentY = originalNode.y;
                let currentX = originalNode.x + originalNode.width + 10;

                for (let i = 0; i < chunkIndex.length; i++) {
                  let defaultY = currentY + chunkIndex[i].length * 400;
                  for (let j = chunkIndex[i].length - 1; j >= 0; j -= 1) {
                    const clonedWidget = originalNode.cloneWidget({
                      note: msg.notes[chunkIndex[i][j]],
                    });

                    clonedWidget.x = currentX;
                    clonedWidget.y = defaultY + 40;

                    defaultY = defaultY - 400 - 40;
                  }
                  currentX = currentX + 800 + 40;
                }

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
      cornerRadius={16}
      spacing={48}
      direction="vertical"
      width={800}
      height={
        showMore[note.id as keyof object]
          ? note.comment.length < 600
            ? 400
            : note.comment.length < 1000
            ? 600
            : note.comment.length < 10000
            ? 1000
            : "hug-contents"
          : 400
      }
      strokeWidth={2}
      fill={"#f7f8fa"}
      hoverStyle={{ fill: "#ffffff" }}
      stroke="#dce0e6"
      strokeAlign="center"
      key={note.id}
    >
      <AutoLayout
        padding={
          note.comment.length < 300
            ? {
                horizontal: 48,
                vertical: 16,
              }
            : {
                horizontal: 24,
                vertical: 8,
              }
        }
        spacing={24}
        width={"fill-parent"}
        height={"fill-parent"}
        direction="vertical"
      >
        <AutoLayout width={"fill-parent"} spacing={8} direction="horizontal">
          {note.labels.data.map((label) => (
            <Text
              fontSize={20}
              italic
              fill={"#fb3569"}
              key={label.text}
              // stroke="#fff"
              // strokeAlign="center"
              // strokeWidth={1}
            >
              {label.text}
            </Text>
          ))}
        </AutoLayout>

        <Text fontSize={32} width={"fill-parent"}>
          {note.title}
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
            fontSize={
              showMore[note.id as keyof object]
                ? note.comment.length < 600
                  ? 20
                  : note.comment.length < 1000
                  ? 16
                  : note.comment.length < 10000
                  ? 12
                  : 10
                : 20
            }
            width={"fill-parent"}
          >
            {showMore[note.id as keyof object]
              ? note.comment
              : note.comment.slice(0, 501)}
          </Text>
          <Text
            onClick={() => {
              setShowMore((comment) =>
                comment[note.id as keyof object]
                  ? { ...comment, [note.id]: false }
                  : { ...comment, [note.id]: true }
              );
            }}
            fill={"#fb3569"}
          >
            {note.comment.length > 500
              ? showMore[note.id as keyof object]
                ? "Show Less"
                : "Show More"
              : ""}
          </Text>
        </AutoLayout>
        <Text
          href={`https://app.heymarvin.com/annotation_tool/event/${note.key}`}
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
  );
}

widget.register(Widget);
