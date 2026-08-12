# Incontec Dash

Internal operations dashboard for Incontec: live data tables backed by Supabase/PostgreSQL, with search, filtering, sorting, pagination, and report exports (Relatorios page). Includes an AI assistant panel wired to an n8n webhook, with a graceful fallback when the AI service is unavailable.

## Features

Real-time data tables sourced from Supabase, replacing an earlier mock-data prototype. Search, sort, aging filter, and pagination on data tables. Report exports on the Relatorios page. AI assistant panel connected to an n8n workflow via webhook. Visual polish including page transitions, card hover states, and toasts.

## Stack

JavaScript, HTML, and CSS in a modular structure split into css/ and js/. Supabase (PostgreSQL) for data. n8n for AI and automation workflows.

## Project structure

index.html is the entry point. css/ holds stylesheets. js/ holds app logic, Supabase queries, and UI interactions. n8n/ holds workflow definitions for the AI assistant panel.

## Status

Actively maintained internal tool. Not intended for public deployment as-is, since it ships without seed or demo data.
