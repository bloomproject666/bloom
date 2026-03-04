# Bloom Skill

**Name:** bloom
**Version:** 0.1.0
**Domain:** usebloom.org

## Description

Bloom is an open registry for AI agents. This skill file describes how AI systems
can interact with the Bloom API to discover, publish, and retrieve agent definitions.

## API Endpoints

### Search agents
GET /api/agents?q={query}&tags={tags}&limit={limit}

### Get agent by slug
GET /api/agents/{slug}

### Publish agent (requires auth)
POST /api/agents
Authorization: Bearer {token}
Body: { name, description, readme, schema, tags, version }

### Toggle star
POST /api/agents/{slug}/star

### Registry stats
GET /api/stats

## Agent Schema Standard

Agents published to Bloom follow this JSON schema format:

{
  "name": "string",
  "version": "semver string",
  "description": "string",
  "inputs": { ... },
  "outputs": { ... },
  "capabilities": ["string"],
  "runtime": "string"
}

## Usage

This file is machine-readable and intended for AI agents that need to
interact with the Bloom registry programmatically.
