# Monitoring for a Region

## Monitor Notes

1. https://tyrasd.github.io/osm-qa-feeds/
2. Search for Reagion to Create Bbox
3. **Use the "OSM Notes" RSS Feed to monitor all notes and note comments**

## Monitor Changesets by New Users

1. https://osmcha.org/
2. Dropdown: Username => "My Saved Filters"
3. "Save Filter" Button => Name "<Region> New Users"
4. Click on this name in the list to open the filter config
   - "Date": Set start date
   - "Location": Select "State" > Search
   - "Changeset size bound": Set to 2
   - "Reasons for Flagging": "New Mapper"
   - "Review Status": "Not Reviewed"
5. "Save" (at the top) with same Name
6. Go to "My Saved Filters"
7. **Use the RSS Feed to monitor all changesets of New Users**

## Monitor Changesets by "Review Requested"

Users can select a checkbox "Review requested" in iD Editor when they save their changeset.

1. https://osmcha.org/
2. Dropdown: Username => "My Saved Filters"
3. "Save Filter" Button => Name "<Region> Review Requested"
4. Click on this name in the list to open the filter config
   - "Date": Set start date
   - "Location": Select "State" > Search
   - "Changeset size bound": Set to 2
   - **"Reasons for Flagging": "Review Requested"**
   - "Review Status": "Not Reviewed"
5. "Save" (at the top) with same Name
6. Go to "My Saved Filters"
7. **Use the RSS Feed to monitor all changesets of Review Requested**

## Monitor Changesets – all unreviewed

Both searches above prioritize some changes. This one will show everything that was not reviewed, yet. This is not ideal, since not everything can be reviewed in the first two groups because the review system is not ideal for this use case: There is only one global review per changeset and quite a few changes cannot be approved by. Those don't get a status, so they show up twice…

1. https://osmcha.org/
2. Dropdown: Username => "My Saved Filters"
3. "Save Filter" Button => Name "<Region> Review Requested"
4. Click on this name in the list to open the filter config
   - "Date": Set start date
   - "Location": Select "State" > Search
   - "Changeset size bound": Set to 2
   - NO "Reasons for Flagging"
   - "Review Status": "Not Reviewed"
5. "Save" (at the top) with same Name
6. Go to "My Saved Filters"
7. **Use the RSS Feed to monitor all changesets without a review**

## Monitor Changesets by "Bad Review"

Whenever we mark something as "bad", we likely want to find it again to follow up. The filters above are set up to hide the reviewed changesets. This one list ony the "bad" once. It is good practise to also "resolve" the "bad" mark.

1. https://osmcha.org/
2. Dropdown: Username => "My Saved Filters"
3. "Save Filter" Button => Name "<Region> Bad reviews"
4. Click on this name in the list to open the filter config
   - "Date": Set start date
   - "Location": Select "State" > Search
   - "Changeset size bound": Set to 2
   - NO "Reasons for Flagging"
   - **"Review Status": "Only bad"**
5. "Save" (at the top) with same Name
6. Go to "My Saved Filters"
7. **Use the RSS Feed to monitor all changesets without a bad review**
