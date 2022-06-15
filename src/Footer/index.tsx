import React,{FC,MouseEventHandler} from "react";
import './index.css'

/* 左侧键盘 */
const arr = [1,2,3,4,5,6,7,8,9,0,"."]

/*  */
interface FooterProps{
    onSelect:(type:string,e?:string|undefined)=>void
    isDisabled:boolean
}

const Footer:FC<FooterProps>=({onSelect,isDisabled})=>{   
/* 设置onSelect删除钩子 */
    const handleDelete=()=>{
        onSelect("delete")
    }
/* 设置onSelect添加钩子 */
    const handleAdd:MouseEventHandler<HTMLDivElement>=(e)=>{
        const addMoney = (e.target as HTMLElement).innerText
        onSelect("add",addMoney)
    }
/* 设置onSelect提交钩子 */
    const handleSubmit=()=>{
        
        if(!isDisabled){
            onSelect("submit")
        }
       
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