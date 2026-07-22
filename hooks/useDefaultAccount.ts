import { useState, useEffect } from 'react';
import { AccountRepository, AccountRow } from '../repositories/AccountRepository';

const accountRepo = new AccountRepository();

export function useDefaultAccount() {
  const [account, setAccount] = useState<AccountRow | null>(null);

  useEffect(() => {
    accountRepo.getDefault().then(setAccount).catch(console.error);
  }, []);

  return account;
}