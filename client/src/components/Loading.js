import './Loading.css'
import {BeatLoader} from 'react-spinners'

function Loading() {

   
    return (
        <div className="loading">
            <BeatLoader loading />
        </div>
    )
      
}

export default Loading