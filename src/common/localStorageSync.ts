// Synchronous functions to access and modify Chrome's local storage

export const getLocalStorageSync = (key: string) : Promise<any> => {
    return new Promise(resolve => {
      chrome.storage.local.get([key], (value) => {
        resolve(value[key]);
      });
    });
  }
  
export const setLocalStorageSync = (key: string, value: any) : Promise<null> => {
    return new Promise(resolve => {
      chrome.storage.local.set({[key]: value}, () => {
        resolve(null);
      })
    });
  }
  
export const clearLocalStorageSync = () : Promise<null> => {
    return new Promise(resolve => {
      chrome.storage.local.clear(() => {
        resolve(null);
      })
    })
  }