"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Clock,
  Headphones,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ContactForm from "@/components/contact-form";

export function ContactSection() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@vettedge.domains",
    },
    { icon: MessageSquare, title: "Live Chat", description: "Available 24/7" },
  ];

  return (
    <section className=" py-8   sm:py-12   dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2"
            style={{ borderColor: "#33BDC7", color: "#33BDC7" }}
          >
            Get In Touch
          </Badge>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: "#33BDC7" }}
          >
            Ready to Find Your
            <span className="block" style={{ color: "#33BDC7" }}>
              Perfect Domain ?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our domain experts are here to help you find the perfect aged domain
            for your business. Get personalized recommendations and expert
            guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start ">
          {/* Contact Form */}
          <div>
            <ContactForm
              variant="home"
              headerTitle="Send us a Message"
              headerDescription="Get expert advice on domain selection and SEO potential"
              className=""
            />
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3
                  className="text-xl md:text-2xl font-bold mb-4"
                  style={{ color: "#33BDC7" }}
                >
                  Multiple Ways to Connect
                </h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
                  Choose the contact method that works best for you. Our team is
                  available 24/7 to assist with your domain investment needs.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index}>
                    <Card
                      className="border-l-4 hover:shadow-lg px-4 transition-shadow bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      style={{ borderLeftColor: "#33BDC7" }}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 border border-[#3BD17A] xl flex items-center justify-center">
                            <method.icon className="h-6 w-6 text-[#3BD17A]" />
                          </div>
                          <div>
                            <h4
                              className="text-lg font-semibold"
                              style={{ color: "#33BDC7" }}
                            >
                              {method.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Why Choose Us */}
              <div>
                <Card
                  style={{
                    backgroundColor: "#33BDC7",
                    color: "white",
                    border: "none",
                  }}
                  className="dark:bg-[#33BDC7] px-4"
                >
                  <CardContent className="pt-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Headphones className="h-6 w-6 mr-2" />
                      Why Choose Our Support?
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Expert domain consultants available 24/7",
                        "Personalized domain recommendations",
                        "Free SEO analysis and potential assessment",
                        "Secure transfer assistance and guidance",
                      ].map((text, idx) => (
                        <div className="flex items-center space-x-3" key={idx}>
                          <CheckCircle className="h-5 w-5 text-white" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
