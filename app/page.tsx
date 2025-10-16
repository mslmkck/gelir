"use client";

import { AppLayout } from "@/components/layout";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Checkbox,
} from "@/components/ui";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Welcome to Your Modern App
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            A full-stack foundation built with Next.js 14, TypeScript, TailwindCSS, and Headless UI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Active users in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">12,543</p>
              <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                ↑ 12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">$45,231</p>
              <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                ↑ 8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">23</p>
              <p className="mt-2 text-sm text-warning-600 dark:text-warning-400">
                → No change from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>Various button styles and variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Badge Components</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Badge variant="primary" size="sm">
                  Small
                </Badge>
                <Badge variant="primary" size="md">
                  Medium
                </Badge>
                <Badge variant="primary" size="lg">
                  Large
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Example Card with Badges</CardTitle>
              <CardDescription>Project status overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Authentication System
                  </span>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Dashboard UI</span>
                  <Badge variant="warning">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">API Integration</span>
                  <Badge variant="error">Blocked</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Documentation</span>
                  <Badge variant="neutral">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields and form controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input label="Email" type="email" placeholder="Enter your email" fullWidth />
                <Select
                  label="Country"
                  fullWidth
                  options={[
                    { value: "", label: "Select a country" },
                    { value: "us", label: "United States" },
                    { value: "uk", label: "United Kingdom" },
                    { value: "ca", label: "Canada" },
                  ]}
                />
                <Checkbox label="I agree to the terms and conditions" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>Send us a message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" fullWidth />
                <Input label="Last Name" placeholder="Doe" fullWidth />
              </div>
              <Input label="Email" type="email" placeholder="john.doe@example.com" fullWidth />
              <Textarea
                label="Message"
                placeholder="Tell us what you think..."
                rows={4}
                fullWidth
              />
              <Checkbox label="Subscribe to newsletter" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button variant="primary">Send Message</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
