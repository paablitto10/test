import * as Linking from 'expo-linking'
import {ScrollView} from 'react-native'
import {Separator} from '@shared/ui/separator'
import {Text} from '@shared/ui/text'

export default function PrivacyScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="px-6 py-3 gap-2">
      <Text>
        Hey there! Thanks for using ExpoLaunch. Here's the lowdown on what data we collect, how we
        use it, and how we keep it safe. We aim to be as transparent as possible, so let's dive in!
      </Text>

      <Text className="mt-2 font-semiBold text-xl">Contact Us</Text>
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
      <Text className="text-center text-muted-foreground">Last updated: 1/4/2025</Text>
    </ScrollView>
  )
}
