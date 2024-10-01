import { useState } from "react";
import Board from "./components/Board";


function App() {
  const [textareaContent, setTextareaContent] = useState('');
  const pgn = "1. h4 a5 2. h5 a4 3. b4 axb3 4. h6 b2 5. hxg7 bxa1=Q 6. gxh8=Q Qxa2 7. d3 Nc6 8. Nd2 Nb4 9. Ndf3 Qa3 10. Qxg8 Qa2 11. Rxh7 Qa3 12. Qxf7# ";

  const handleTextareaChange = (event) => {
    setTextareaContent(event.target.value);
  };

  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[600px]">
          <Board pgn={pgn}/>
        </div>
        <textarea 
          value={textareaContent}
          onChange={handleTextareaChange}
          className="ml-4 p-2 border border-gray-300 rounded h-[300px]"
          placeholder="Type here..."
        />
      </div>
    </>
  )
}

export default App;
