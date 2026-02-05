# Agent Schemas

> **Audience**: Developers, maintainers

This document defines the standard schema format for agent specifications.

## Agent Specification Format

All agents follow this JSON structure:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "agent_id": "agent-name",
  "version": "1.0.0",
  "created": "ISO8601 timestamp",
  "type": "core | feature | validation | testing | monitoring",
  "description": "What this agent does",
  
  "mandate": {
    "primary": "Main responsibility",
    "constraints": ["What it cannot do"]
  },
  
  "inputs": {
    "input_name": {
      "description": "What this input is",
      "type": "schema type",
      "required": true
    }
  },
  
  "outputs": {
    "output_name": {
      "description": "What this output is",
      "type": "schema type"
    }
  },
  
  "gates": {
    "pre": ["Conditions before execution"],
    "post": ["Conditions after execution"]
  },
  
  "hard_rules": ["Invariants that must always hold"]
}
```

## Input/Output Schemas

### Schema-Guard Agent

```json
{
  "inputs": {
    "schema_files": {
      "type": "array",
      "items": { "type": "string", "format": "filepath" }
    },
    "data_to_validate": {
      "type": "object"
    }
  },
  "outputs": {
    "valid": { "type": "boolean" },
    "errors": {
      "type": "array",
      "items": {
        "path": "string",
        "message": "string",
        "severity": "error | warning"
      }
    }
  }
}
```

### UX-Composer Agent

```json
{
  "inputs": {
    "composition_request": {
      "type": "object",
      "properties": {
        "page_type": { "type": "string" },
        "blocks": { "type": "array" },
        "user_preferences": { "type": "object" }
      }
    },
    "device_type": {
      "type": "string",
      "enum": ["desktop", "tablet", "mobile"]
    },
    "theme_config": {
      "type": "object"
    }
  },
  "outputs": {
    "layout": {
      "type": "object",
      "properties": {
        "blocks": { "type": "array" },
        "styles": { "type": "object" }
      }
    },
    "render_time_ms": { "type": "number" }
  }
}
```

### AI-Layout Agent

```json
{
  "inputs": {
    "current_layout": {
      "type": "object"
    },
    "optimization_goals": {
      "type": "array",
      "items": { "type": "string" }
    },
    "constraints": {
      "type": "object",
      "properties": {
        "max_cost": { "type": "number" },
        "allowed_actions": { "type": "array" }
      }
    }
  },
  "outputs": {
    "suggestions": {
      "type": "array",
      "items": {
        "action": { "type": "string" },
        "target": { "type": "string" },
        "reasoning": { "type": "string" },
        "confidence": { "type": "number" }
      }
    },
    "cost_incurred": { "type": "number" },
    "reversible": { "type": "boolean" }
  }
}
```

### Security-Auditor Agent

```json
{
  "inputs": {
    "audit_scope": {
      "type": "array",
      "items": { "type": "string" }
    },
    "security_config": {
      "type": "object"
    }
  },
  "outputs": {
    "findings": {
      "type": "array",
      "items": {
        "id": { "type": "string" },
        "severity": { "enum": ["critical", "high", "medium", "low"] },
        "category": { "type": "string" },
        "description": { "type": "string" },
        "remediation": { "type": "string" }
      }
    },
    "passed": { "type": "boolean" },
    "score": { "type": "number", "minimum": 0, "maximum": 100 }
  }
}
```

### Packaging Agent

```json
{
  "inputs": {
    "source_path": { "type": "string" },
    "build_config": {
      "type": "object",
      "properties": {
        "target": { "type": "string" },
        "environment": { "type": "string" }
      }
    }
  },
  "outputs": {
    "artifacts": {
      "type": "array",
      "items": {
        "name": { "type": "string" },
        "path": { "type": "string" },
        "hash": { "type": "string" },
        "size_bytes": { "type": "number" }
      }
    },
    "sbom": { "type": "object" },
    "build_reproducible": { "type": "boolean" }
  }
}
```

## Common Types

### Severity Levels
```json
{
  "severity": {
    "type": "string",
    "enum": ["critical", "high", "medium", "low", "info"]
  }
}
```

### Agent Result
```json
{
  "agent_result": {
    "type": "object",
    "properties": {
      "success": { "type": "boolean" },
      "message": { "type": "string" },
      "duration_ms": { "type": "number" },
      "metadata": { "type": "object" }
    }
  }
}
```

## Validation

All agent inputs/outputs are validated by the Schema-Guard Agent:

1. Input validation before execution
2. Output validation after execution
3. Type checking at build time

## Related

- [Agent Roster](./agent-roster.md)
- [Execution Flow](./execution-flow.md)
