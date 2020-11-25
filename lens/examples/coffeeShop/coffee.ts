let json =
    {
        "order": {
            "prices": "$3.45",
            "cupsize": {"selected": "large", "options": ["small", "medium", "large"]},
            "milktype": {"selected": "fullfat", "options": ["semi", "fullfat", "almond", "soy"]},
            "extra shots": {"selected": 1, "options": [0, 1, 2]}
        },
        "metadata": {"server": "bob"}
    }
function setMilkType(orderAndMetadata, milkType) {
    return {...orderAndMetadata, ...orderAndMetadata.order, milktype: {selected: milkType}}
}