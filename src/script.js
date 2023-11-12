// Подключение к Ethereum кошельку пользователя и создание объекта контракта
window.addEventListener('load', async () => {
    // Проверяем, установлен ли у пользователя MetaMask
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        try {

            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {

            console.error("User denied account access");
            document.getElementById('status-message').innerText = "User denied account access";
            return;
        }
    } else {

        console.error("Please install MetaMask!");
        document.getElementById('status-message').innerText = "Please install MetaMask!";
        return;
    }


    const contractABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
              }
            ],
            "name": "IdentityCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "verifier",
                "type": "address"
              }
            ],
            "name": "IdentityVerified",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "identities",
            "outputs": [
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "dateOfBirth",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "nationality",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "verifiers",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
              }
            ],
            "name": "registerVerifier",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_name",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_dob",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_nationality",
                "type": "string"
              }
            ],
            "name": "createIdentity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "verifyIdentity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "getIdentity",
            "outputs": [
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          }
    ];
    const contractAddress = '0x6c68542F98011CFAfd0fe88d513Ba10c501e2601';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
        console.error("No accessible accounts!");
        return;
    }

    const account = accounts[0];

    async function createIdentity(name, dob, nationality) {
        try {
            const receipt = await contract.methods.createIdentity(name, dob, nationality).send({ from: account });
            console.log(`Transaction hash: ${receipt.transactionHash}`);
            document.getElementById('status-message').innerText = `Identity created. Transaction hash: ${receipt.transactionHash}`;
        } catch (error) {
            console.error(error);
            document.getElementById('status-message').innerText = error.message;
        }
    }

    async function getIdentity(address) {
        try {
            const identityInfo = await contract.methods.getIdentity(address).call();
            document.getElementById('user-name-result').innerText = `Name: ${identityInfo.name}`;
            document.getElementById('user-data-result').innerText = `Verified: ${identityInfo.isVerified}`;
        } catch (error) {
            console.error(error);
            document.getElementById('status-message').innerText = error.message;
        }
    }

    const verifierAddress = "0x7f94a8dFaf3e1b18D893CB5e890d47Fb0f5104C7"; // Адреса веріфаєра 

        contract.methods.registerVerifier(verifierAddress).send({ from: account })
        .then(function(receipt) {
            console.log("Verifier has been registered:", receipt);
        })
        .catch(function(error) {
            console.error("Error registering verifier:", error);
        });

    document.getElementById('create-identity-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name-input').value;
        const dob = document.getElementById('dob-input').value;
        const nationality = document.getElementById('nationality-input').value;
        await createIdentity(name, dob, nationality);
    });

    document.getElementById('get-identity-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const address = document.getElementById('identity-address-input').value;
        await getIdentity(address);
    });

    document.getElementById('verify-identity-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userAddress = document.getElementById('user-address-input').value;
        try {
          const receipt = await contract.methods.verifyIdentity(userAddress).send({ from: account });
          console.log(`Transaction hash: ${receipt.transactionHash}`);
          document.getElementById('status-message').innerText = `Identity verified. Transaction hash: ${receipt.transactionHash}`;
        } catch (error) {
          console.error(error);
          document.getElementById('status-message').innerText = error.message;
        }
      });
});
