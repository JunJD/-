import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.css'

interface WithdrawalRecordProps{
  Tobewithdrawn?:number,
  ServiceCharge?:number
}


function App() {
  const [inputValue,setInputValue] = useState<string>('') //input框UI数据
  const [money,setMoney] = useState<string>('') //零钱余额UI数据
  const [isDisabled,setIsDisabled ] = useState<boolean>(false) //是否禁用按钮
  
  const [WithdrawalRecordArr , SetWithdrawalRecordArr] = useState<WithdrawalRecordProps[]>([])

  const Cumulative =useMemo(()=>{
    const cumulative = 10000.00-Number(money)
    localStorage.setItem('cumulative',`${cumulative}`)//存储数据库
    return cumulative
  },[money]) //记录已提现的累计额度

      const isRef = useRef(false)
  useEffect(()=>{
          if(isRef.current){

            localStorage.setItem("withdrawalRecordArr",JSON.stringify(WithdrawalRecordArr))

          }else{
            localStorage.setItem('money',"10000.00")
            setMoney((10000).toFixed(2))
            isRef.current=true
          }
  },[setMoney,WithdrawalRecordArr])

/* 解决规则1问题，提现不得超过余额 */
  const isSubmit=(value:string)=>{
    /* 获取当前的剩余总额 */
    const balance = localStorage.getItem("money")

    setInputValue((prevalue)=>{
      const currentValue =  prevalue.concat(value)

      setIsDisabled(false) //避免错误失误导致后续也无法提现

      if (currentValue[0] === '.') return prevalue; // 第一位是小数点，阻止更新
      
      if (currentValue[0] === '0') { // 第一位是0
        if (currentValue[1] && currentValue[1] !== '.') return prevalue ; // 第二位存在且不是小数点，阻止更新
      }
    
      if (currentValue.split('').filter(s => s === '.').length > 1) return prevalue; // 包含多个小数点，阻止更新
    
    
      if (currentValue.includes('.')) { // 小数
        if (currentValue.split('.')[1].length > 2) return prevalue; // 小数位大于2，阻止更新
      }

      if (Number(currentValue)>Number(balance)) return prevalue; // 超过了总额度
    
    
      if (currentValue[currentValue.length-1]==='.') { 
        
       setIsDisabled(true) // 以小数点结尾 按钮失效
      }

      if (currentValue === '0' || currentValue === '0.0' || currentValue === '0.00') {
        setIsDisabled(true)     // 以上几种情况 按钮失效
      } 

        return currentValue
    })

  }

  /* 做了键盘事件与input框交互的适配*/
  const handleChange=(e:any)=>{
    if(Number(e.nativeEvent.data)){
    isSubmit(e.nativeEvent.data)
    }
  }

  /* input框 和 底部键盘交互 */
  const handleSelect:(type: string, e?: string | undefined) => void=(type,value)=>{
    switch(type){
      case "add": 
        if(value) {isSubmit(value)}
        break;
      case "delete": 
        setInputValue((prevalue)=>{
          return String.prototype.slice.call(prevalue,0,prevalue.length-1)
        })
        break;
      case "submit": //
      if(inputValue){
        if(window.confirm("确定提现吗")){

          setInputValue('')

        handleMoney(Number(inputValue))
      }
      }else{
        setIsDisabled(true) // 未输入 按钮失效
      }
        

    }
  }

/* 解决规则3问题，记录提现记录 */
  const SetWithdrawalRecordArrFun =(Tobewithdrawn:number,ServiceCharge?:number)=>{
      
    SetWithdrawalRecordArr((preWithdrawalRecord)=>{
      return [...preWithdrawalRecord,{Tobewithdrawn,ServiceCharge:ServiceCharge||0}]
    })
  }

  /* 处理提交后的数据计算和保存 */
  const handleMoney=(Tobewithdrawn:number)=>{
    
    //在"数据库"中获取总额
    const getMoney = localStorage.getItem("money")
    //总额 - 需提现
    let balance = Number(getMoney) - Tobewithdrawn

/* 解决规则2问题，累计1000内免手续费 */
    if(Cumulative+Tobewithdrawn>1000){
/* 解决规则4问题，服务费最少0.1元 */
        const ServiceCharge = Tobewithdrawn*(1/1000)>=0.1?Tobewithdrawn*(1/1000):0.1

        balance=balance-ServiceCharge // 加上提现手续费后的剩余额度

      // SetWithdrawalRecordArr((preWithdrawalRecord)=>{
      //   return [...preWithdrawalRecord,{Tobewithdrawn,ServiceCharge}]
      // })
      SetWithdrawalRecordArrFun(Tobewithdrawn,ServiceCharge)

    }else{
      // SetWithdrawalRecordArr((preWithdrawalRecord)=>{
      //   return [...preWithdrawalRecord,{Tobewithdrawn,ServiceCharge:0}]
      // })
      SetWithdrawalRecordArrFun(Tobewithdrawn)
    }

    //返回至localstorage
    localStorage.setItem('money',`${balance}`)
    //更新UI显示
    setMoney(balance.toFixed(2))

  }


  return (
    <div className="container">
      <Header inputValue={inputValue} money={money} onChange={handleChange} />
      <Footer onSelect={handleSelect}  isDisabled={isDisabled} />
    </div>
  );
}

export default App;
