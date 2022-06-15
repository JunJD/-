
import React,{FC} from "react";
import './index.css'

interface HeaderProps{
    inputValue:string,
    money:string,
    onChange:any,
    onSelect:(type:string,e?:string|undefined)=>void
}
const Header:FC<HeaderProps>=(props)=>{



    const {
        inputValue,
        money,
        onChange,
        onSelect
    }=props
    const handleAllWithdrawal=()=>{
        onSelect('all')
    }

    const handleChange=(e:any)=>{
        onChange(e)
    }
    return(
        <header>
        <i>提现金额</i>
        <span>￥<input onChange={handleChange} value={inputValue} name="input" type="text"/></span>
        <div><i>当前零钱余额</i><i>{money}</i><button onClick={handleAllWithdrawal}  className="allWithdrawal">全部提现</button></div>
    </header>
    )
}
export default Header