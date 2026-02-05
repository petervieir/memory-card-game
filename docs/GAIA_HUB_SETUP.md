# Gaia Hub Implementation

## Overview

This project uses a **self-hosted Gaia hub** for decentralized storage of NFT metadata and user data. The Gaia hub implementation is maintained in a **separate repository** and deployed independently.

## Why a Separate Repository?

The Gaia hub is maintained separately for several important reasons:

### 1. **Reusability Across Projects**
The Gaia hub implementation is generic and can be used by any Stacks dApp that needs decentralized storage. By keeping it separate, we can:
- Use the same hub for multiple dApps
- Share the implementation with the community
- Avoid duplicating infrastructure code

### 2. **Independent Deployment Lifecycle**
The Gaia hub has its own:
- Deployment pipeline (Docker → Render)
- Environment configuration
- Scaling requirements
- Monitoring and maintenance needs

Separating it prevents unnecessary rebuilds of the game frontend when only storage changes are needed.

### 3. **Service-Oriented Architecture**
This follows the microservices pattern where:
- **Frontend** (Vercel) - User interface and game logic
- **Smart Contracts** (Stacks Blockchain) - On-chain game state and NFTs
- **Gaia Hub** (Render) - Off-chain decentralized storage

Each service can be developed, deployed, and scaled independently.

### 4. **Security and Permissions**
The Gaia hub requires:
- Different environment variables
- Storage management
- Network configuration
- Access control policies

Isolating it reduces the attack surface and simplifies permission management.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Memory Card Game                        │
│                    (Vercel Frontend)                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─────────────┐
                 │             │
                 ▼             ▼
        ┌────────────┐  ┌─────────────┐
        │  Stacks    │  │  Gaia Hub   │
        │ Blockchain │  │  (Render)   │
        │            │  │             │
        │ • NFTs     │  │ • Metadata  │
        │ • Scores   │  │ • User Data │
        └────────────┘  └─────────────┘
```

## Gaia Hub Repository

**Location:** Separate GitHub repository (or Docker registry)  
**Deployment:** Render.com (containerized deployment)  
**URL:** `https://gaia-hub-render.onrender.com`

### Key Features

The Gaia hub implementation includes:
- ✅ SIP-009 NFT metadata storage
- ✅ User data persistence
- ✅ Authentication via Stacks signatures
- ✅ Disk-based storage driver
- ✅ HTTP API for read/write operations
- ✅ Static file serving for public reads

## Integration with Memory Card Game

### Environment Variables

The game connects to the Gaia hub via environment variables:

**Vercel (Frontend):**
```bash
NEXT_PUBLIC_GAIA_HUB_URL=https://gaia-hub-render.onrender.com
```

This tells the frontend where to send storage requests.

### How It Works

1. **User Mints NFT:**
   - Game generates metadata JSON
   - Uploads to Gaia hub via authenticated API call
   - Receives public URL for the metadata

2. **User Views NFT:**
   - Metadata URL is stored in the smart contract
   - Anyone can read the metadata via HTTP GET
   - No authentication required for reads

3. **User Stores Game Data:**
   - Game state, preferences, achievements
   - Stored in user's private Gaia bucket
   - Only accessible by the user's wallet

### API Flow

```typescript
// Upload NFT metadata (authenticated)
POST https://gaia-hub-render.onrender.com/store/{address}/{path}
Headers: Authorization: Bearer {stacks-auth-token}
Body: JSON metadata

Response: { publicURL: "https://gaia-hub-render.onrender.com/{address}/{path}" }

// Read metadata (public)
GET https://gaia-hub-render.onrender.com/{address}/{path}
Response: JSON metadata
```

## Gaia Hub Configuration

### Dockerfile Structure

The Gaia hub uses a custom Dockerfile that:

1. **Clones Gaia v2.9.0** from stacks-archive/gaia
2. **Patches for ESM compatibility** (adds `__dirname` support)
3. **Adds static file serving** (enables HTTP GET for stored files)
4. **Configures disk driver** (local file storage)

### Environment Variables (Render)

```bash
GAIA_PORT=3000
GAIA_DRIVER=disk
GAIA_DISK_STORAGE_ROOT_DIR=/gaia-storage
GAIA_READ_URL=https://gaia-hub-render.onrender.com/
NODE_OPTIONS=--experimental-specifier-resolution=node
```

**Important:** `GAIA_READ_URL` must include the trailing slash!

### Storage Backend

**Current:** Disk storage (`/gaia-storage` directory)  
**Production Recommendation:** Migrate to cloud storage (S3, Google Cloud Storage, Azure)

For production deployments, consider:
- S3 for durability and CDN integration
- Google Cloud Storage for global distribution
- Azure Blob Storage for redundancy

## Alternative: Public Gaia Hubs

Instead of self-hosting, you can use public Gaia hubs:

### Hiro's Public Hub
```bash
NEXT_PUBLIC_GAIA_HUB_URL=https://gaia.blockstack.org/hub
```

### Pros of Self-Hosting:
- ✅ Full control over data
- ✅ No rate limits
- ✅ Custom storage backend
- ✅ Privacy and compliance
- ✅ Cost optimization

### Cons of Self-Hosting:
- ❌ Infrastructure maintenance
- ❌ Monitoring and uptime
- ❌ Security responsibility
- ❌ Scaling complexity

## Deployment Guide

### 1. Deploy Gaia Hub to Render

**Repository:** Use the separate Gaia hub repository  
**Service Type:** Web Service  
**Build Command:** Docker build  
**Start Command:** Specified in Dockerfile

### 2. Configure Environment

Set the environment variables in Render dashboard:
- `GAIA_READ_URL` - Your Render service URL (with trailing `/`)
- `GAIA_DISK_STORAGE_ROOT_DIR` - `/gaia-storage`
- `GAIA_DRIVER` - `disk`

### 3. Update Frontend Configuration

In Vercel, set:
```bash
NEXT_PUBLIC_GAIA_HUB_URL=https://your-gaia-service.onrender.com
```

### 4. Test the Integration

```bash
# Check hub info
curl https://your-gaia-service.onrender.com/hub_info

# Expected response:
{
  "challenge_text": "[\"gaiahub\",\"0\",\"gaia-0\",\"blockstack_storage_please_sign\"]",
  "latest_auth_version": "v1",
  "max_file_upload_size_megabytes": 20,
  "read_url_prefix": "https://your-gaia-service.onrender.com/"
}
```

## Maintenance

### Monitoring

Monitor these metrics:
- **Uptime** - Hub availability
- **Storage Usage** - Disk space consumption
- **Request Rate** - API calls per second
- **Error Rate** - Failed uploads/reads

### Backup Strategy

For disk-based storage:
1. Regular backups of `/gaia-storage` directory
2. Offload to S3 or similar for redundancy
3. Test restore procedures

For cloud storage (S3/GCS/Azure):
1. Enable versioning
2. Configure lifecycle policies
3. Set up cross-region replication

### Scaling

As usage grows:
1. **Vertical Scaling** - Increase Render instance size
2. **Horizontal Scaling** - Multiple Gaia hub instances with load balancer
3. **Storage Migration** - Move from disk to cloud storage
4. **CDN Integration** - Cache static metadata files

## Security Considerations

### Authentication

- Write operations require Stacks wallet signatures
- Read operations are public (by design)
- Each user has isolated storage bucket

### Data Privacy

- User data is stored in user-specific directories
- Only the wallet owner can write to their bucket
- Metadata stored on-chain is public

### Best Practices

1. **HTTPS Only** - Always use encrypted connections
2. **Rate Limiting** - Implement at proxy level (Render supports this)
3. **Input Validation** - Gaia validates file sizes and paths
4. **CORS Configuration** - Allow frontend domain

## Troubleshooting

### Common Issues

**1. "Cannot GET /address/file.json"**
- **Cause:** Static file serving not configured
- **Fix:** Ensure Dockerfile patches http.js to add `express.static`

**2. "validation_error" on upload**
- **Cause:** Missing trailing slash in `GAIA_READ_URL`
- **Fix:** Add `/` to the end of the URL

**3. "Contract not found"**
- **Cause:** Smart contracts not deployed to network
- **Fix:** Deploy contracts with `clarinet deployments apply`

**4. "Gaia upload failed"**
- **Cause:** Hub URL not set or incorrect
- **Fix:** Check `NEXT_PUBLIC_GAIA_HUB_URL` in Vercel

## References

- [Gaia Documentation](https://docs.stacks.co/build-apps/references/gaia)
- [Stacks Storage Guide](https://docs.stacks.co/build-apps/guides/data-storage)
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [Render Documentation](https://render.com/docs)

## Support

For issues specific to:
- **Gaia Hub Implementation** - Check the Gaia hub repository
- **Memory Card Game Integration** - Open issue in this repository
- **Stacks Storage Concepts** - Visit [Stacks Discord](https://discord.gg/stacks)

---

**Last Updated:** February 2026  
**Gaia Version:** v2.9.0  
**Deployment Platform:** Render.com
