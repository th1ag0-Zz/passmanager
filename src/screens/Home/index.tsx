import React, { useState, useCallback, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import { SearchBar } from '../../components/SearchBar'
import { LoginDataItem } from '../../components/LoginDataItem'

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage,
} from './styles'

interface LoginDataProps {
  id: string
  title: string
  email: string
  password: string
}

type LoginListDataProps = LoginDataProps[]

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([])
  const [data, setData] = useState<LoginListDataProps>([])

  async function loadData() {
    const dataKey = '@passmanager:logins'

    const storage = await AsyncStorage.getItem(dataKey)

    const storageParsed = storage
      ? (JSON.parse(storage) as LoginListDataProps)
      : ([] as LoginListDataProps)

    setData(storageParsed)
    setSearchListData(storageParsed)
  }
  useEffect(() => {
    loadData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, []),
  )

  function handleFilterLoginData(search: string) {
    if (search === '') {
      setSearchListData(data)
    } else {
      const dataFiltered = data.filter((item) => item.title.includes(search))

      // if (dataFiltered.length === 0) {
      //   setSearchListData(data)
      // } else {
      setSearchListData(dataFiltered)
      // }
    }
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        }
        renderItem={({ item: loginData }) => {
          return (
            <LoginDataItem
              title={loginData.title}
              email={loginData.email}
              password={loginData.password}
            />
          )
        }}
      />
    </Container>
  )
}
