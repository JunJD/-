import React,{FC} from "react";
import './index.css'

/* 左侧键盘 */
const arr = [1,2,3,4,5,6,7,8,9,0,"."]

interface FooterProps{
    onSelect:(type:string,e?:any)=>void
}
const Footer:FC<FooterProps>=({onSelect})=>{   
    const handleDelete=()=>{
        onSelect("delete")
    }
    const handleAdd=(e:any)=>{
        const addMoney = e.target.innerText
        onSelect("add",addMoney)
        
    }
    const handleSubmit=()=>{
        onSelect("submit")
    }
    return(
        <footer>
             <div className="left">
            {arr.map((item)=>{
               return(
                <div key={item} className="c2"
                onClick={handleAdd}
                >
                <p>{item}</p>
                </div>
               )
            })}
        </div>
        <div className="right">
            <div 
            className="c2"
            onClick={handleDelete}
            >
                <p>删除</p>
            </div>

            <div className="c3"
            onClick={handleSubmit}
            >    
                <p>提现</p>
            </div>
        </div>
        </footer>
    )
}
export default Footer