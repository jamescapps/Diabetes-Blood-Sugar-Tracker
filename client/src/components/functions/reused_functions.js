import axios from 'axios'



export function getData() {
    axios.get('/bloodsugar')
            .then(response => response.data)
}

export const test = () => {
    console.log("This test works!")
}

