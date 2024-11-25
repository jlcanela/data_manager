export function loadXml(xmlFilePath: string): Promise<string> {
    // Path to your XML file
    //const xmlFilePath = './PartyDetailEdit.xml';
  
    // Fetch the XML file
    return fetch(xmlFilePath)
      .then((response) => response.text()) // Get the response as text
      .then((xmlString) => {
        // Parse the XML string into a DOM object
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  
        // // Example: Access specific elements from the XML
        // const titleElements = xmlDoc.getElementsByTagName("title");
        // if (titleElements.length > 0) {
        //   const title= (titleElements[0].textContent); // Prints content of first <title> element
        // }
  
        return xmlString;
      })
      .catch((error) => {
        console.error("Error loading the XML file:", error);
        throw error;
      });
  }