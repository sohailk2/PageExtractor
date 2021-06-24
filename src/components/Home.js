import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import SplitPane, { Pane } from 'react-split-pane';
import SimplePaper from "./paper.tsx"
import LeftPane from './LeftPane';
import RightPane from './RightPane';
import axios from 'axios';

const backendURL = "localhost:8000/"

function search() {
   
}


export default function Home() {

    const [rawHTML, setRawHTML] = useState("")
    const [frameURL, setFrameURL] = useState("https://waf.cs.illinois.edu/");
    const [textURL, setTextURL] = useState("https://waf.cs.illinois.edu/");

    const updatePanes = (url) => {

        axios.get(backendURL + 'getWebsite?url=' + url)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

        setFrameURL(frameURL)
    }

    /*
    const styles = {
        splitScreen : {
            display: 'flex',
            // flexDirection: 'row'
        },
        topPane: {
            width: '50%'
        },
        bottomPane: {
            width: '50%'
        }
    }
    */

    return (
        <div style={{ marginTop: '', justify: 'left', height: '100vh' }}>
            <center>
                <div>
                    <TextField id="standard-basic" shrink={false} value={textURL} onChange={(e) => { setTextURL(e.target.value) }} />
                    <Button variant="contained" onClick={() => { updatePanes(textURL); }}>Go</Button>
                </div>

            </center>

            {/* <div className={styles.splitScreen}>
                <div className={styles.topPane}>{<iframe src={frameURL} />}</div>
                <div className={styles.bottomPane}>{<iframe src={frameURL} />}</div>
            </div> */}
            {/* <div style={{ width: '100%', color: 'red', borderStyle: 'solid' }}>
                <SplitPane split="vertical" >
                    <Pane>
                        Lefr
                </Pane>
                    <Pane>
                        Right
                </Pane>
                </SplitPane>
            </div> */}

            <SplitPane split="vertical" minSize={200} defaultSize={1200} maxSize={400}>
                {/* src: https://codesandbox.io/s/wr0gf?file=/src/App.tsx */}
                <div>
                    <LeftPane frameURL={frameURL} rawHTML={rawHTML}/>
                </div>
                <div>
                    <RightPane frameURL={frameURL} />
                </div>
            </SplitPane>

        </div>

    )

}