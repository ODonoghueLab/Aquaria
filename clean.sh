git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch public/downloads/*" \
  --prune-empty --tag-name-filter cat -- --all