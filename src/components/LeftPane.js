import React from 'react'
import styles from "../styles/splitScreen.css"
import Iframe from 'react-iframe'

export default function LeftPane(props) {
    return (
        <div className={styles.pane} style={{ height: '92vh', minWidth: '100%' }}>
            {
                <iframe srcdoc={props.rawHTML} style={{height: '100vh', minWidth: '100%'}}/>
                
                // <Iframe 
                //     // url={props.frameURL}
                //     // src="../../public/index.html"
                //     src="<html><body>Hello, <b>world</b>.</body></html>"
                //     width="100%"
                //     height="100%"
                //     display="initial"
                //     position="relative" />
            }
        </div>)
}