import './SignUp.css';
import { useState , useRef} from 'react';
import SignImg from '../images/SignupImg.svg'
import SignImg2 from '../images/SignupImg2.svg'

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode, FilePondImageResize, FilePondPluginImageEdit, FilePondPluginImageTransform, FilePondPluginImageCrop, FilePondPluginFileValidateType);

function SignUp() {
  const [file, setFile] = useState('');
  const [usernameReg, setUsernameReg] = useState('');
  const [userEmailReg, setEmailReg] = useState('');
  const [userPasswordReg, setPasswordReg] = useState('');


  async function registerUser(e){
    e.preventDefault();

    const formData = new FormData();

    const body = {
        usernameReg,
        userEmailReg,
        userPasswordReg,
        file
    }

    for(let prop in body)
      formData.append(prop, body[prop]);
    try{
      let res = await fetch('http://localhost:5000/posts/register', {
        method: 'POST',
        headers: {
          "Access-Control-Allow-Origin" : "*", 
          "Access-Control-Allow-Credentials" : true,
          "mode": "cors"
        },
        body: formData
      });

      let data = await res.json();

      if(data.user){
        localStorage.setItem('token', data.user)
        alert('Register successful')
        window.location.href = '/'
      }else{
        alert(data.error)
      }
    }catch(error){
      console.log({error: error.message})
    }
  }

  return (
    <div className="signup-container">
      <div className="inputs-container">
          <form className="inputs" onSubmit={registerUser}>
            <h1 id="signup-title">Sign Up</h1>
            {/* <input type="file" name="image" value={file} onChange={(e) => {
              console.log(e.target.files[0]);
              setFile(e.target.files[0]);
            }}/> */}
            <FilePond
              file={file}
              onupdatefiles={(files)=> setFile(files[0].file)}
              name="avatar" 
              labelIdle='Drag & Drop your img or <span class="filepond--label-action">Browse</span>'
              stylePanelLayout= 'compact circle'
              imageCropAspectRatio= '1:1'
              styleLoadIndicatorPosition= 'center bottom'
              styleProgressIndicatorPosition= 'right bottom'
              styleButtonRemoveItemPosition= 'left bottom'
              styleButtonProcessItemPosition= 'right bottom'
            />
            <input placeholder="Username" type="text" name="username" className="inputs-sign-up" onChange={(e) => setUsernameReg(e.target.value)}/>
            <input placeholder="Email" type="email"  name="email" className="inputs-sign-up" onChange={(e) => setEmailReg(e.target.value)}/>
            <input placeholder='Password' type="password"  name="password" className="inputs-sign-up" onChange={(e) => setPasswordReg(e.target.value)}/>
            <button className='signup-btn' type="submit"><FontAwesomeIcon icon={faArrowRight} /></button>
          </form>
          <a href="/signin" className="sign-in-aref">already have an account?</a>
      </div>
        <img src={SignImg} className="singup-img"/>
        <img src={SignImg2} className="singup-img2"/>
    </div>

  );
}

export default SignUp;


