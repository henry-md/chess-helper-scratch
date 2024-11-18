import { useEffect, useRef } from 'react';
import Chess from 'chess.js';

const PgnGenerator = (pgn) => {
  // const treeRef = useRef(null);

  // useEffect(() => {
  //   /* turn the pgn into a tree of moves */
  //   const chess = new Chess();
  //   chess.loadPgn(pgn);
  // }, [pgn]);
  
  const myMethod = () => {
    console.log('myMethod');
  };

  // const nextPgn = () => {
  //   // Implementation of generatePgn function
  //   const chess = new Chess();
  //   chess.reset();
  //   return "1. h4 a5 2. h5 a4 3. b4 axb3 4. h6 b2 5. hxg7 bxa1=Q 6. gxh8=Q Qxa2 7. d3 Nc6 8. Nd2 Nb4 9. Ndf3 Qa3 10. Qxg8 Qa2 11. Rxh7 Qa3 12. Qxf7# ";
  // };

  return {
    myMethod
  }
};

export default PgnGenerator;