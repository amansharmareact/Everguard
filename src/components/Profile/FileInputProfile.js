import React from 'react'
import dropbutton from '../../images/upload.png'
import docs from "../../images/docs.png";
import pdf from "../../images/docs.png"
export default function FileInput(props) {
    const {error,dictionary, label,id,info,images=[],onDelete,doctype="image",limit = 4,warning,accept=""} = props;
    return (
      <>
      <div className={`file_input_box_wrapper file_input_box_wrapper_profile ${images.length >= limit && "disable"}`}>
        <div className="added_images added_images_profile">
          {images.map(item=>{
            return <div className="img_box img_box_profile"><button type="button" onClick={()=>onDelete(item)}><i className="fa fa-times"></i></button><img src={doctype=="image"?item:item.includes('.pdf')?pdf:docs}/></div>
          })}
        </div>
        
        <div className="file_input_box file_input_box_profile">
        {/*<h3>{label} </h3>*/}
        <label htmlFor={id} accept={accept} className="drop_area drop_area_profile">
            <img src={dropbutton}/>
            <span>{dictionary.select_file}</span>
        </label>
        {/*<p>{info}</p>*/}
        <p className="warning"><span>{dictionary.please_note}</span> {warning || dictionary.please_note_text}</p>
        </div>
        {images.length < limit &&(
        <input id={id} {...props} type="file" accept={`${doctype=="image"?"image/*":"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}`} />
        ) }
        {/* <div className="text-right">
        <label class="btn" htmlFor={id}>Browser</label>
        </div> */}
        </div>
        {error ? (
          <p  
          style={{ paddingTop: 5,
          fontSize:13,
          color:"red",
          textAlign: "left"
        }}>
            {error}
          </p>
        ) : null}
      </>
    );
}
