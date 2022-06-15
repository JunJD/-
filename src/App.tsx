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

  const [WithdrawalRecordArr , SetWithdrawalRecordArr] = useState<WithdrawalRecordProps[]>([])

  const Cumulative =useMemo(()=>{
    const cumulative = 10000.00-Number(money)
    localStorage.setItem('cumulative',`${cumulative}`)//存储数据库
    return cumulative
  },[money]) //记录已提现的累计额度

      const isRef = useRef(false)
  useEffect(()=>{
          if(isRef.current){

/* 解决规则3问题，记录提现记录 */
            localStorage.setItem("withdrawalRecordArr",JSON.stringify(WithdrawalRecordArr))

          }else{
            localStorage.setItem('money',"10000.00")
            setMoney((10000).toFixed(2))
            isRef.current=true
          }
  },[setMoney,WithdrawalRecordArr])

/* 解决规则1问题，提现不得超过余额 */
  const isSubmit=(value:string)=>{
    const balance = localStorage.getItem("money")

    setInputValue((prevalue)=>{

      if(Number(balance)>=(Number(prevalue)*10)){
        var patt = /^[0-9]+([.]{1}[0-9]+){0,1}$/;

        if(patt.test(value)||(prevalue?.indexOf('.')===-1 && prevalue.length)){
            const index = prevalue?.indexOf('.')
            const length = String.prototype.slice.call(prevalue,index).length

            if(length>2){
/*解决规则3问题，小数点后最多两位数进行提现 */
              console.error("请最少输入0.01元~")
              return prevalue
            }

            return prevalue.concat(value)
        }   

      }

        alert("余额不是那么足了~")
        console.error("余额不是那么足了~")
        return prevalue
    })

  }

  /* input框UI */
  const handleSelect=(type:string,value:string)=>{
    switch(type){
      case "add":
        isSubmit(value)
        break;
      case "delete":
        setInputValue((prevalue)=>{
          return String.prototype.slice.call(prevalue,0,prevalue.length-1)
        })
        break;
      case "submit":
        //1s后清空
        setTimeout(()=>{
          setInputValue('')
        },1000)
        handleMoney(Number(inputValue))
    }
  }

  /* 处理提交后的数据计算和保存 */
  const handleMoney=(Tobewithdrawn:number)=>{
    
    //在"数据库"中获取总额
    const getMoney = localStorage.getItem("money")
    //总额 - 需提现
    let balance = Number(getMoney) - Tobewithdrawn

/* 解决规则2问题，累计1000内免手续费 */
    if(Cumulative+Tobewithdrawn>1000){
/* 解决规则3问题，服务费最少0.1元 */
        const ServiceCharge = Tobewithdrawn*(1/1000)>=0.1?Tobewithdrawn*(1/1000):0.1

        balance=balance-ServiceCharge

      SetWithdrawalRecordArr((preWithdrawalRecord:any)=>{
        console.log(preWithdrawalRecord);
        return [...preWithdrawalRecord,{Tobewithdrawn,ServiceCharge}]
      })
    }else{
      SetWithdrawalRecordArr((preWithdrawalRecord:any)=>{
        return [...preWithdrawalRecord,{Tobewithdrawn,ServiceCharge:0}]
      })
    }



    //返回至localstorage
    localStorage.setItem('money',`${balance}`)
    //更新UI显示
    setMoney(balance.toFixed(2))

    

  }

  return (
    <div className="container">
      <Header inputValue={inputValue} money={money} />
      <Footer onSelect={handleSelect} />
    </div>
  );
}

export default App;
