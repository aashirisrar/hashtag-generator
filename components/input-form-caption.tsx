"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { ChatCompletionMessage } from "openai/resources";

const formSchema = z.object({
  input: z.string().min(2, {
    message: "Input must be at least 2 characters.",
  }),
});

export function InputFormCaption() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userMessage = { role: "user", content: values.input };
      const newMessages = [...messages, userMessage];
      const response = await axios.post("api/caption", {
        messages: newMessages,
      });
      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input placeholder="Landscape" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="mt-4 w-1/2">
        <div className="mb-2 font-semibold text-2xl">The best tags for:</div>
        <div>
          {messages.map((message) => (
            <div className="px-4 py-3 m-2 rounded-md bg-muted">
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
