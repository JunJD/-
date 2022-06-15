import React,{FC} from "react";
import './index.css'

interface HeaderProps{
    inputValue:string,
    money:string,
    onChange:any
}
const Header:FC<HeaderProps>=(props)=>{

    const {
        inputValue,
        money,
        onChange
    }=props
const handleChange=(e:any)=>{
    onChange(e)
}
    return(
        <header>
        <i>提现金额</i>
        <span>￥<input onChange={handleChange} value={inputValue} name="input" type="text"/></span>
        <div><span>当前零钱余额</span><i>{money}</i></div>
    </header>
    )
}
export default Header