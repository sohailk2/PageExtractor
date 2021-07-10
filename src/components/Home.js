import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import SplitPane, { Pane } from 'react-split-pane';
import SimplePaper from "./paper.tsx"
import LeftPane from './LeftPane';
import RightPane from './RightPane';

import Cookies from 'js-cookie';
import axios from 'axios';

let csrftoken = null;
const backendURL = "http://localhost:8000/api/"

async function getCsrfToken() {
    if (csrftoken === null) {
        const response = await fetch(`${backendURL}/csrf/`, {
            credentials: 'include',
        });
        const data = await response.json();
        csrftoken = data.csrfToken;
    }
    return csrftoken;
}

function search() {

}


export default function Home() {

    const [rawHTML, setRawHTML] = useState("")
    const [conceptTerms, setConceptTerms] = useState([])
    const [frameURL, setFrameURL] = useState("https://waf.cs.illinois.edu/");
    const [textURL, setTextURL] = useState("https://waf.cs.illinois.edu/");

    const updatePanes = (url) => {


        var data = JSON.stringify({ "url": url });

        var config = {
            method: 'post',
            url: 'http://localhost:8000/api/getWebsite',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                setRawHTML(response.data.rawHTML)
                setConceptTerms(response.data.conceptTerms)
            })
            .catch(function (error) {
                console.log(error);
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
                    <TextField style={{ width: '85%' }} id="standard-basic" shrink={false} value={textURL} onChange={(e) => { setTextURL(e.target.value) }} />
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

            <SplitPane split="vertical" minSize={200} defaultSize={1200} maxSize={400} pane2Style={{ overflowY: 'auto' }}>
                {/* src: https://codesandbox.io/s/wr0gf?file=/src/App.tsx */}
                <div>
                    <LeftPane frameURL={frameURL} rawHTML={rawHTML} />
                </div>
                <div>
                    <RightPane frameURL={frameURL} conceptTerms={conceptTerms} />
                </div>
            </SplitPane>

        </div>

    )

}