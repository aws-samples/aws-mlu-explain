def viz(decision_tree, feature_names=None):
  from warnings import warn

  js = ""

  def node_to_str(tree, node_id, criterion):
    if not isinstance(criterion, sklearn.tree.tree.six.string_types):
      criterion = "impurity"

    value = tree.value[node_id]
    if tree.n_outputs == 1:
      value = value[0, :]

    if tree.children_left[node_id] == sklearn.tree._tree.TREE_LEAF:
      return '{"id": "%s", "criterion": "%s", "impurity": "%s", "samples": "%s", "value": "%s"}' \
             % (node_id, 
                criterion,
                tree.impurity[node_id],
                tree.n_node_samples[node_id],
                value)
    else:
      if feature_names is not None:
        feature = feature_names[tree.feature[node_id]]
      else:
        feature = tree.feature[node_id]

      return '"id": "%s", "rule": "%s <= %.4f", "%s": "%s", "samples": "%s"' \
             % (node_id, 
                feature,
                tree.threshold[node_id],
                criterion,
                tree.impurity[node_id],
                tree.n_node_samples[node_id])

  def recurse(tree, node_id, criterion, parent=None, depth=0):
    tabs = "  " * depth
    js = ""

    left_child = tree.children_left[node_id]
    right_child = tree.children_right[node_id]

    js = js + "\n" + \
         tabs + "{\n" + \
         tabs + "  " + node_to_str(tree, node_id, criterion)

    if left_child != sklearn.tree._tree.TREE_LEAF and depth < 6:
      js = js + ",\n" + \
           tabs + '  "left": ' + \
           recurse(tree, \
                   left_child, \
                   criterion=criterion, \
                   parent=node_id, \
                   depth=depth + 1) + ",\n" + \
           tabs + '  "right": ' + \
           recurse(tree, \
                   right_child, \
                   criterion=criterion, \
                   parent=node_id,
                   depth=depth + 1)

    js = js + tabs + "\n" + \
         tabs + "}"

    return js

  if isinstance(decision_tree, sklearn.tree.tree.Tree):
    js = js + recurse(decision_tree, 0, criterion="impurity")
  else:
    js = js + recurse(decision_tree.tree_, 0, criterion=decision_tree.criterion)

  return js

cols = dict()
for i, c in enumerate(income_trn.columns):
  cols[i] = c.name

print viz(clf, feature_names=cols)