#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./deploy.sh [command] [options]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo "  deploy   - Deploy changes with a new version tag"
    echo "  rollback - Rollback to a specific version"
    echo "  list     - List all available versions"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  -m, --message  Commit message (required for deploy)"
    echo "  -v, --version  Version to rollback to (required for rollback)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo '  ./deploy.sh deploy -m "feat: added new dashboard features"'
    echo "  ./deploy.sh rollback -v v1.0.0"
    echo "  ./deploy.sh list"
}

# Function to deploy changes
deploy() {
    local message=$1
    if [ -z "$message" ]; then
        echo -e "${RED}Error: Commit message is required${NC}"
        show_help
        exit 1
    fi

    # Get the current version
    local current_version=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
    local major=$(echo $current_version | cut -d. -f1)
    local minor=$(echo $current_version | cut -d. -f2)
    local patch=$(echo $current_version | cut -d. -f3)
    
    # Increment patch version
    patch=$((patch + 1))
    local new_version="${major}.${minor}.${patch}"

    echo -e "${YELLOW}Deploying changes...${NC}"
    
    # Add all changes
    git add .
    
    # Commit changes
    git commit -m "$message"
    
    # Create a new tag
    git tag -a $new_version -m "$message"
    
    # Push changes and tags
    git push origin development
    git push origin $new_version
    
    echo -e "${GREEN}Successfully deployed version $new_version${NC}"
}

# Function to rollback to a specific version
rollback() {
    local version=$1
    if [ -z "$version" ]; then
        echo -e "${RED}Error: Version is required${NC}"
        show_help
        exit 1
    fi

    # Check if version exists
    if ! git rev-parse $version >/dev/null 2>&1; then
        echo -e "${RED}Error: Version $version does not exist${NC}"
        exit 1
    }

    echo -e "${YELLOW}Rolling back to version $version...${NC}"
    
    # Create a new branch from the specified tag
    git checkout -b rollback/$version $version
    
    # Push the rollback branch
    git push origin rollback/$version
    
    echo -e "${GREEN}Successfully rolled back to version $version${NC}"
    echo -e "${YELLOW}Created new branch: rollback/$version${NC}"
    echo -e "${YELLOW}To complete rollback, merge this branch into development:${NC}"
    echo "  git checkout development"
    echo "  git merge rollback/$version"
    echo "  git push origin development"
}

# Function to list all versions
list_versions() {
    echo -e "${YELLOW}Available versions:${NC}"
    git tag -l -n1
}

# Main script logic
case "$1" in
    deploy)
        shift
        while [ $# -gt 0 ]; do
            case "$1" in
                -m|--message)
                    deploy "$2"
                    shift 2
                    ;;
                *)
                    echo -e "${RED}Error: Invalid option $1${NC}"
                    show_help
                    exit 1
                    ;;
            esac
        done
        ;;
    rollback)
        shift
        while [ $# -gt 0 ]; do
            case "$1" in
                -v|--version)
                    rollback "$2"
                    shift 2
                    ;;
                *)
                    echo -e "${RED}Error: Invalid option $1${NC}"
                    show_help
                    exit 1
                    ;;
            esac
        done
        ;;
    list)
        list_versions
        ;;
    *)
        show_help
        ;;
esac 