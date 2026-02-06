import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, PressableCard } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { Divider, Spacer } from "@/components/ui/divider";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { QuantityInput } from "@/components/ui/quantity-input";
import { SafeArea } from "@/components/ui/safe-area";
import {
  Body,
  Caption,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Label,
  Typography,
} from "@/components/ui/typography";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function ComponentsDemo() {
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handlePress = (componentName: string) => {
    Alert.alert("Pressed", `You pressed ${componentName}`);
  };

  return (
    <SafeArea>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          <Heading1 className="mb-6">Component Demo</Heading1>

          {/* Typography Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Typography</Heading2>
              <Heading1 className="mb-2">Heading 1</Heading1>
              <Heading2 className="mb-2">Heading 2</Heading2>
              <Heading3 className="mb-2">Heading 3</Heading3>
              <Heading4 className="mb-2">Heading 4</Heading4>
              <Body className="mb-2">Body text - Regular text content</Body>
              <Body className="mb-2">
                <Typography color="muted">Muted text</Typography>
              </Body>
              <Caption className="mb-2">Caption text - Small details</Caption>
              <Label className="mb-2">Label text</Label>
              <View className="flex-row gap-2 flex-wrap">
                <Typography color="primary">Primary</Typography>
                <Typography color="success">Success</Typography>
                <Typography color="warning">Warning</Typography>
                <Typography color="error">Error</Typography>
              </View>
            </View>
          </Card>

          {/* Buttons Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Buttons</Heading2>

              <Label className="mb-2">Button Variants</Label>
              <View className="gap-3 mb-4">
                <Button
                  variant="primary"
                  onPress={() => handlePress("Primary Button")}>
                  Primary Button
                </Button>
                <Button
                  variant="secondary"
                  onPress={() => handlePress("Secondary Button")}>
                  Secondary Button
                </Button>
                <Button
                  variant="outline"
                  onPress={() => handlePress("Outline Button")}>
                  Outline Button
                </Button>
                <Button
                  variant="ghost"
                  onPress={() => handlePress("Ghost Button")}>
                  Ghost Button
                </Button>
                <Button
                  variant="destructive"
                  onPress={() => handlePress("Destructive Button")}>
                  Destructive Button
                </Button>
              </View>

              <Label className="mb-2">Button Sizes</Label>
              <View className="gap-3 mb-4">
                <Button size="sm" variant="primary">
                  Small Button
                </Button>
                <Button size="md" variant="primary">
                  Medium Button
                </Button>
                <Button size="lg" variant="primary">
                  Large Button
                </Button>
              </View>

              <Label className="mb-2">Button States</Label>
              <View className="gap-3 mb-4">
                <Button variant="primary" loading>
                  Loading Button
                </Button>
                <Button variant="primary" disabled>
                  Disabled Button
                </Button>
              </View>

              <Label className="mb-2">Buttons with Icons</Label>
              <View className="gap-3">
                <Button
                  variant="primary"
                  leftIcon={<Ionicons name="add" size={20} color="white" />}>
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  rightIcon={
                    <Ionicons name="arrow-forward" size={20} color="#2563eb" />
                  }>
                  Next
                </Button>
              </View>
            </View>
          </Card>

          {/* Badges Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Badges</Heading2>
              <Label className="mb-2">Badge Variants</Label>
              <View className="flex-row flex-wrap gap-2 mb-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </View>

              <Label className="mb-2">Badge Sizes</Label>
              <View className="flex-row flex-wrap gap-2">
                <Badge size="sm" variant="primary">
                  Small
                </Badge>
                <Badge size="md" variant="primary">
                  Medium
                </Badge>
              </View>
            </View>
          </Card>

          {/* Inputs Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Inputs</Heading2>
              <View className="gap-4">
                <Input
                  label="Basic Input"
                  placeholder="Enter text..."
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                <Input
                  label="Input with Hint"
                  placeholder="Email address"
                  hint="We'll never share your email"
                />
                <Input
                  label="Input with Error"
                  placeholder="Enter text..."
                  error="This field is required"
                />
                <Input
                  label="Password Input"
                  placeholder="Enter password"
                  isPassword
                  value={passwordValue}
                  onChangeText={setPasswordValue}
                />
                <Input
                  label="Input with Left Icon"
                  placeholder="Search..."
                  leftIcon={
                    <Ionicons name="search" size={20} color="#64748b" />
                  }
                />
                <Input
                  label="Disabled Input"
                  placeholder="Can't edit this"
                  disabled
                  value="Disabled value"
                />
              </View>
            </View>
          </Card>

          {/* Cards Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Cards</Heading2>
              <View className="gap-4">
                <Card variant="elevated">
                  <Body>Elevated Card</Body>
                  <Caption className="mt-1">Card with shadow elevation</Caption>
                </Card>
                <Card variant="outlined">
                  <Body>Outlined Card</Body>
                  <Caption className="mt-1">Card with border</Caption>
                </Card>
                <Card variant="filled">
                  <Body>Filled Card</Body>
                  <Caption className="mt-1">
                    Card with filled background
                  </Caption>
                </Card>
                <PressableCard
                  variant="elevated"
                  onPress={() => handlePress("Pressable Card")}>
                  <Body>Pressable Card</Body>
                  <Caption className="mt-1">Tap me!</Caption>
                </PressableCard>
              </View>
            </View>
          </Card>

          {/* Quantity Input Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Quantity Input</Heading2>
              <View className="items-start">
                <Label className="mb-2">Quantity: {quantity}</Label>
                <QuantityInput
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </View>
            </View>
          </Card>

          {/* Loading Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Loading</Heading2>
              <Loading size="small" />
              <Spacer size="md" />
              <Loading size="large" text="Loading data..." />
            </View>
          </Card>

          {/* Divider Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Dividers & Spacers</Heading2>
              <Body>Content above divider</Body>
              <Spacer size="md" />
              <Divider />
              <Spacer size="md" />
              <Body>Content below divider</Body>
              <Spacer size="lg" />
              <View className="flex-row items-center">
                <Body>Left</Body>
                <Spacer size="md" horizontal />
                <Divider vertical className="h-8" />
                <Spacer size="md" horizontal />
                <Body>Right</Body>
              </View>
            </View>
          </Card>

          {/* Empty State Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Empty State</Heading2>
              <EmptyState
                icon="cart-outline"
                title="No Items"
                description="Your cart is empty. Start adding items to see them here."
                actionLabel="Start Shopping"
                onAction={() => handlePress("Empty State Action")}
              />
            </View>
          </Card>

          {/* Collapsible Section */}
          <Card variant="outlined" className="mb-6">
            <View className="p-4">
              <Heading2 className="mb-4">Collapsible</Heading2>
              <Collapsible title="Click to expand">
                <View className="mt-2">
                  <Body>
                    This content is hidden by default and shows when you click
                    the header.
                  </Body>
                </View>
              </Collapsible>
              <Spacer size="md" />
              <Collapsible title="Another collapsible">
                <View className="mt-2">
                  <Body>More hidden content here!</Body>
                </View>
              </Collapsible>
            </View>
          </Card>

          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeArea>
  );
}
