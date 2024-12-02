import JsonViewer from "../components/JsonViewer";

const JsonViewerPage = () => {
  const jsonData = {
    hello: "world",
    isEnabled: true,
    secretNumber: 123,
    lorem: "ipsum",
    inception: {
      hello2: "world",
      isEnabled2: true,
      nested3: {
        lorem2: "ipsum",
        secretNumber2: 123
      },
      nested: {
        jon: "snow",
        nested2: {
          nested4: {
            jon: "snow"
          }
        }
      }
    }
  };

  return (
    <div>
      <JsonViewer data={jsonData} />
    </div>
  );
};

export default JsonViewerPage;
