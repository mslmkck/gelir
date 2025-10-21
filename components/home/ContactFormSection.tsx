"use client";

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Input, Textarea } from "@/components/ui";

export default function ContactFormSection() {
  return (
    <Card variant="bordered" aria-labelledby="contact-form-heading">
      <CardHeader>
        <CardTitle id="contact-form-heading">Contact Form</CardTitle>
        <CardDescription>Send us a message</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" fullWidth autoComplete="given-name" />
            <Input label="Last Name" placeholder="Doe" fullWidth autoComplete="family-name" />
          </div>
          <Input label="Email" type="email" placeholder="john.doe@example.com" fullWidth autoComplete="email" />
          <Textarea
            label="Message"
            placeholder="Tell us what you think..."
            rows={4}
            fullWidth
            aria-describedby="contact-form-helper"
          />
          <Checkbox label="Subscribe to newsletter" />
        </div>
        <p id="contact-form-helper" className="sr-only">
          All fields are optional, but sharing more context helps us respond quickly.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Send Message</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
