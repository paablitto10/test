import * as Linking from 'expo-linking'
import {ScrollView} from 'react-native'
import {Separator} from '@shared/ui/separator'
import {Text} from '@shared/ui/text'

export default function TermsScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="px-6 py-3 gap-2">
      <Text className="mt-2 font-semiBold text-xl">1. Introduction</Text>
      <Text>
        Welcome to ExpoLaunch These Terms of Use ("Terms") govern your use of the ExpoLaunch mobile
        application ("App"), which provides a personal finance tracking service. By using this App,
        you agree to be bound by these Terms. If you do not agree with any part of these Terms,
        please do not use the App.
      </Text>

      <Text className="mt-2 font-semiBold text-xl">12. Contact Us</Text>
      <Text>Got any questions or concerns? Feel free to reach out to us at:</Text>
      <Text>
        Email:{' '}
        <Text
          className="text-blue-600"
          onPress={() => Linking.openURL('mailto:jonypopovv@gmail.com')}
        >
          jonypopovv@gmail.com
        </Text>
      </Text>

      <Separator className="mx-auto my-3 w-[70%]" />
      <Text className="text-center text-muted-foreground">Last updated: 7/8/2024</Text>
    </ScrollView>
  )
}
