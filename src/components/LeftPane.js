import React from 'react'
import styles from "../styles/splitScreen.css"

export default function LeftPane(props) {

    const iframe = <iframe srcDoc={props.rawHTML} style={{height: '100vh', minWidth: '100%'}}/>

    const rawHTML = `
    <html>
    <body>
          <h2>Children</h2>Joe has three kids:<br/>
          <ul>
           <li>
           <a href="#">Child 1 name</a>
           </li>
           <li>kid2</li>
           <li>kid3</li>
          </ul>
    </body>
   </html>`
   let char_start = 0;
   let char_end = 0
   let doc = new DOMParser().parseFromString(rawHTML,'text/html');
   let xpathNode = doc.evaluate("/html/body/ul/li[1]", doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
   const highlightedNode = xpathNode.singleNodeValue.innerHTML;
   const textValuePrev = highlightedNode.slice(0, char_start);
   const textValueAfter = highlightedNode.slice(char_end, highlightedNode.length);
   xpathNode.singleNodeValue.innerHTML = `
                                          <span style="background-color: #FFFF00"'>
                                          ${highlightedNode}
                                          </span>`;


    return (
        <div className={styles.pane} style={{ height: '92vh', minWidth: '100%' }}>
            {/* {
                iframe
            } */}
            <div dangerouslySetInnerHTML={{__html: doc.body.outerHTML}} />
        </div>
    )
}