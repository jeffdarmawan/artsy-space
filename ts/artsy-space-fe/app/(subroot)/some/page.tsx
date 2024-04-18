'use client'

import { useAccount } from 'wagmi'
import { getAccount } from '@wagmi/core'
// import { config } from './config' 

function App() {
//   const account = getAccount(config);
    const account = useAccount();
    console.log("account:");
    console.log(account);
    return (
        <div>
        <h1>Account</h1>
        <p>{account.address}</p>
        </div>
    );
}

export default App;